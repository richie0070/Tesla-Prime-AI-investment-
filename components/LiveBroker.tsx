import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { TradingStats } from '../types';

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY || 'dummy_key_for_tests';
    ai = new GoogleGenAI({ apiKey: key });
  }
  return ai;
}

// --- Audio Helpers ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Transcript {
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

interface LiveBrokerProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: TradingStats;
  liveMarkets?: any[];
}

const LiveBroker: React.FC<LiveBrokerProps> = ({ isOpen, onClose, stats, liveMarkets }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [realtimeInput, setRealtimeInput] = useState('');
  const [realtimeOutput, setRealtimeOutput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Accumulator for current turn text
  const currentTurnRef = useRef({ input: '', output: '' });

  // Visualizer Refs
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      disconnect();
    }
    return () => {
      disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, realtimeInput, realtimeOutput]);

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    cancelAnimationFrame(animationFrameRef.current);
    setStatus('disconnected');
    setIsSpeaking(false);
    setTranscripts([]);
    setRealtimeInput('');
    setRealtimeOutput('');
    currentTurnRef.current = { input: '', output: '' };
  };

  const connect = async () => {
    setStatus('connecting');

    try {
      // 1. Audio Setup
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      // 2. Visualizer Setup
      const analyser = outputCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;
      const outputNode = outputCtx.createGain();
      outputNode.connect(analyser);
      analyser.connect(outputCtx.destination);

      // 3. Connect Live API
      const sessionPromise = getAI().live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: {
             parts: [{ text: `You are Tesla Prime, an institutional-grade AI trading assistant. Speak concisely, professionally, and use financial terminology. Do not be conversational. Focus on market execution, data verification, and portfolio status. Keep answers under 2 sentences.
             
Current Portfolio:
Balance: $${stats?.balance.toFixed(2) || '0.00'}
Profit: $${stats?.profit.toFixed(2) || '0.00'}
Active Trades: ${stats?.trades || 0}

Live Markets:
${liveMarkets?.map(m => `${m.symbol}: $${m.price.toFixed(2)} (${m.change > 0 ? '+' : ''}${m.change.toFixed(2)})`).join('\n') || 'No market data available.'}
` }]
          }
        },
        callbacks: {
            onopen: async () => {
                setStatus('connected');
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    streamRef.current = stream;
                    const source = inputCtx.createMediaStreamSource(stream);
                    const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => {
                             session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputCtx.destination);
                } catch (err) {
                    console.error("Mic Error:", err);
                    setStatus('disconnected');
                }
            },
            onmessage: async (message: LiveServerMessage) => {
                // Transcription Handling
                if (message.serverContent?.inputTranscription?.text) {
                    const text = message.serverContent.inputTranscription.text;
                    currentTurnRef.current.input += text;
                    setRealtimeInput(currentTurnRef.current.input);
                }
                if (message.serverContent?.outputTranscription?.text) {
                    const text = message.serverContent.outputTranscription.text;
                    currentTurnRef.current.output += text;
                    setRealtimeOutput(currentTurnRef.current.output);
                }

                if (message.serverContent?.turnComplete) {
                    const { input, output } = currentTurnRef.current;
                    if (input || output) {
                         setTranscripts(prev => [
                             ...prev,
                             ...(input ? [{ role: 'user', text: input, timestamp: new Date() } as Transcript] : []),
                             ...(output ? [{ role: 'model', text: output, timestamp: new Date() } as Transcript] : [])
                         ]);
                    }
                    currentTurnRef.current = { input: '', output: '' };
                    setRealtimeInput('');
                    setRealtimeOutput('');
                }

                // Audio Output Handling
                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    setIsSpeaking(true);
                    const outputCtx = outputAudioContextRef.current;
                    if (!outputCtx) return;

                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);

                    const source = outputCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    
                    source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                        if (sourcesRef.current.size === 0) setIsSpeaking(false);
                    });

                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                }
                
                if (message.serverContent?.interrupted) {
                    sourcesRef.current.forEach(src => src.stop());
                    sourcesRef.current.clear();
                    nextStartTimeRef.current = 0;
                    setIsSpeaking(false);
                    // Commit partial transcription on interrupt
                    if (currentTurnRef.current.output) {
                         setTranscripts(prev => [...prev, { role: 'model', text: currentTurnRef.current.output + ' [INTERRUPTED]', timestamp: new Date() } as Transcript]);
                         currentTurnRef.current.output = '';
                         setRealtimeOutput('');
                    }
                }
            },
            onclose: () => setStatus('disconnected'),
            onerror: (err) => {
                console.error(err);
                setStatus('disconnected');
            }
        }
      });
      sessionRef.current = await sessionPromise;
      startVisualizer();
    } catch (error) {
        console.error("Connection failed", error);
        setStatus('disconnected');
    }
  };

  const startVisualizer = () => {
      const draw = () => {
          if (!canvasRef.current || !analyserRef.current) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = (canvas.width / bufferLength) * 2;
          let barHeight;
          let x = 0;

          // Institutional Neon Gradient
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#020408');
          gradient.addColorStop(0.5, '#00F0FF');
          gradient.addColorStop(1, '#ffffff');

          for(let i = 0; i < bufferLength; i++) {
              // Enhance low frequencies visuals
              barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
              
              ctx.fillStyle = gradient;
              // Mirror effect
              ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
              
              x += barWidth + 1;
          }

          animationFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl transition-opacity" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-lg bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_120px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] ring-1 ring-white/5 h-[80vh]">
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-prime-cyan shadow-[0_0_10px_#00F0FF] animate-pulse' : 'bg-rose-500'}`}></div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${status === 'connected' ? 'text-prime-cyan' : 'text-slate-500'}`}>
                        {status === 'connected' ? 'VOICE UPLINK SECURE' : status === 'connecting' ? 'HANDSHAKING...' : 'DISCONNECTED'}
                    </span>
                </div>
                <h2 className="text-white font-black uppercase tracking-tight font-display text-lg">Tesla Core Live</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors border border-white/5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>

        {/* Visualizer Area */}
        <div className="h-1/3 w-full bg-transparent relative flex items-center justify-center border-b border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00F0FF10_0%,transparent_60%)] pointer-events-none"></div>
            <canvas ref={canvasRef} width={600} height={200} className="w-full h-full opacity-80" />
            
            {status !== 'connected' && (
                <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                     </div>
                </div>
            )}
        </div>

        {/* Transcript Area */}
        <div className="flex-1 bg-black/40 overflow-y-auto p-6 space-y-4 scrollbar-hide relative">
             {transcripts.length === 0 && !realtimeInput && !realtimeOutput && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-30 p-8">
                     <svg className="w-12 h-12 text-slate-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Awaiting Verbal Commands</p>
                 </div>
             )}
             
             {transcripts.map((t, i) => (
                 <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s]`}>
                     <div className={`max-w-[85%] p-4 rounded-2xl border text-xs font-medium leading-relaxed ${
                         t.role === 'user' 
                         ? 'bg-white/5 border-white/10 text-slate-300 rounded-tr-sm' 
                         : 'bg-prime-cyan/10 border-prime-cyan/20 text-prime-cyan rounded-tl-sm'
                     }`}>
                         {t.text}
                     </div>
                 </div>
             ))}

             {/* Realtime Typing Indicators */}
             {(realtimeInput || realtimeOutput) && (
                 <div className={`flex ${realtimeInput ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.1s]`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl border text-xs font-medium leading-relaxed opacity-70 ${
                         realtimeInput 
                         ? 'bg-white/5 border-white/10 text-slate-300 rounded-tr-sm' 
                         : 'bg-prime-cyan/10 border-prime-cyan/20 text-prime-cyan rounded-tl-sm'
                     }`}>
                         {realtimeInput || realtimeOutput}
                         <span className="inline-block w-1 h-3 ml-1 bg-current animate-pulse align-middle"></span>
                    </div>
                 </div>
             )}
             <div ref={transcriptEndRef} />
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/40 border-t border-white/10">
            {status === 'disconnected' ? (
                <button 
                    onClick={connect}
                    className="w-full py-4 bg-white hover:bg-prime-cyan text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-[1.02] font-display flex items-center justify-center gap-3"
                >
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                    Initialize Voice Uplink
                </button>
            ) : (
                <div className="flex gap-4">
                     <div className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 rounded-2xl border border-white/5">
                         {isSpeaking ? (
                             <>
                                <div className="flex gap-1 h-3 items-end">
                                    <div className="w-1 bg-prime-cyan animate-[bounce_0.5s_infinite] h-full"></div>
                                    <div className="w-1 bg-prime-cyan animate-[bounce_0.5s_infinite_0.1s] h-2/3"></div>
                                    <div className="w-1 bg-prime-cyan animate-[bounce_0.5s_infinite_0.2s] h-full"></div>
                                </div>
                                <span className="text-[9px] font-bold text-prime-cyan uppercase tracking-widest">Receiving Data</span>
                             </>
                         ) : (
                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Listening...</span>
                         )}
                     </div>
                     <button 
                        onClick={disconnect}
                        className="px-6 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl border border-rose-500/20 transition-all flex items-center justify-center"
                     >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                     </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LiveBroker;