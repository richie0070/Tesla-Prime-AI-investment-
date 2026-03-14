import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

interface LocalMLWidgetProps {
    symbol: string;
    currentPrice: number;
}

export const LocalMLWidget: React.FC<LocalMLWidgetProps> = ({ symbol, currentPrice }) => {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [backend, setBackend] = useState<string>('Initializing...');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    useEffect(() => {
        // Initialize TFJS and check backend
        const initTf = async () => {
            await tf.ready();
            setBackend(tf.getBackend());
            addLog(`TFJS Ready. Backend: ${tf.getBackend()}`);
        };
        initTf();
    }, []);

    const trainAndPredict = async () => {
        if (isTraining) return;
        setIsTraining(true);
        setProgress(0);
        setPrediction(null);
        setLogs([]);
        addLog('Initializing Neural Network...');

        try {
            // 1. Generate synthetic historical data (e.g., last 50 periods)
            // We simulate a slight upward trend with some noise
            const numSamples = 50;
            const xsData = [];
            const ysData = [];
            
            let simulatedPrice = currentPrice * 0.9; // Start 10% lower
            for (let i = 0; i < numSamples; i++) {
                xsData.push(i);
                // Add trend + noise
                simulatedPrice += (currentPrice - simulatedPrice) / (numSamples - i) + (Math.random() * 2 - 1);
                ysData.push(simulatedPrice);
            }

            // Normalize data for better training
            const xsTensor = tf.tensor2d(xsData, [numSamples, 1]);
            const ysTensor = tf.tensor2d(ysData, [numSamples, 1]);
            
            const xsMax = xsTensor.max();
            const xsMin = xsTensor.min();
            const ysMax = ysTensor.max();
            const ysMin = ysTensor.min();
            
            const normalizedXs = xsTensor.sub(xsMin).div(xsMax.sub(xsMin));
            const normalizedYs = ysTensor.sub(ysMin).div(ysMax.sub(ysMin));

            // 2. Build a simple sequential model
            const model = tf.sequential();
            model.add(tf.layers.dense({ units: 16, inputShape: [1], activation: 'relu' }));
            model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
            model.add(tf.layers.dense({ units: 1 }));

            model.compile({
                optimizer: tf.train.adam(0.05),
                loss: 'meanSquaredError'
            });

            addLog('Model Compiled. Starting Training...');

            // 3. Train the model
            const epochs = 50;
            await model.fit(normalizedXs, normalizedYs, {
                epochs,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        setProgress(Math.round(((epoch + 1) / epochs) * 100));
                        if (epoch % 10 === 0) {
                            addLog(`Epoch ${epoch + 1}: Loss = ${logs?.loss.toFixed(4)}`);
                        }
                    }
                }
            });

            addLog('Training Complete. Running Inference...');

            // 4. Predict the next step (index 50)
            const nextX = tf.tensor2d([numSamples], [1, 1]);
            const normalizedNextX = nextX.sub(xsMin).div(xsMax.sub(xsMin));
            
            const normalizedPred = model.predict(normalizedNextX) as tf.Tensor;
            
            // Denormalize prediction
            const unNormalizedPred = normalizedPred.mul(ysMax.sub(ysMin)).add(ysMin);
            const predictedValue = (await unNormalizedPred.data())[0];
            
            setPrediction(predictedValue);
            addLog(`Prediction: $${predictedValue.toFixed(2)}`);

            // Cleanup tensors
            tf.dispose([xsTensor, ysTensor, normalizedXs, normalizedYs, nextX, normalizedNextX, normalizedPred, unNormalizedPred]);
            
        } catch (error) {
            console.error(error);
            addLog('Error during training.');
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-prime-cyan/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative overflow-hidden group transition-all duration-500 hover:border-prime-cyan/50">
            <div className="absolute top-0 right-0 p-24 bg-prime-cyan/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-prime-cyan/10 transition-colors duration-700"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-white text-[11px] font-black uppercase tracking-[0.3em] font-display flex items-center gap-3">
                        <div className="relative">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-prime-cyan"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            {isTraining && <div className="absolute inset-0 bg-prime-cyan rounded-full animate-ping opacity-50 scale-150"></div>}
                        </div>
                        Local Neural Engine
                    </h3>
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1 h-1 bg-prime-cyan rounded-full"></span>
                        Backend: <span className="text-prime-cyan font-bold">{backend}</span>
                    </div>
                </div>
                <div className="bg-prime-cyan/10 px-3 py-1.5 rounded-xl text-[9px] text-prime-cyan font-black uppercase tracking-widest border border-prime-cyan/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                    TF.JS ACTIVE
                </div>
            </div>

            <div className="mb-8 relative z-10">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    Target Asset
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                </div>
                <div className="flex items-baseline gap-3">
                    <div className="text-4xl font-mono font-bold text-white tracking-tighter">{symbol}</div>
                    <div className="text-lg font-mono font-bold text-slate-500 tracking-tighter">${currentPrice.toFixed(2)}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8 z-10">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Compute Load</div>
                    <div className="text-[10px] text-prime-cyan font-mono font-bold">{progress}%</div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className={`h-full bg-gradient-to-r from-prime-cyan/50 to-prime-cyan transition-all duration-300 ease-out relative ${isTraining ? 'animate-pulse' : ''}`}
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* Terminal Logs */}
            <div className="bg-black/80 rounded-2xl p-5 h-32 border border-white/5 font-mono text-[10px] text-slate-400 flex flex-col justify-end overflow-hidden mb-8 relative z-10 shadow-inner">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
                {logs.length === 0 && !isTraining && <div className="text-slate-700 italic flex items-center gap-2"><span className="w-1 h-3 bg-prime-cyan/50 animate-pulse"></span> Ready for local computation...</div>}
                {logs.map((log, i) => (
                    <div key={i} className="animate-[fadeIn_0.2s] flex items-center gap-2">
                        <span className="text-prime-cyan/50 opacity-50">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                        <span className="text-slate-500">{'>'}</span> 
                        <span className={log.includes('Prediction') ? 'text-prime-cyan font-bold' : ''}>{log}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between relative z-10">
                <button 
                    onClick={trainAndPredict}
                    disabled={isTraining}
                    className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-prime-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95 relative overflow-hidden group/btn"
                >
                    <span className="relative z-10">{isTraining ? 'Training...' : 'Run Prediction'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                </button>

                {prediction !== null && (
                    <div className="text-right animate-[fadeIn_0.5s] bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Neural Forecast</div>
                        <div className={`text-2xl font-mono font-bold tracking-tighter ${prediction > currentPrice ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${prediction.toFixed(2)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
