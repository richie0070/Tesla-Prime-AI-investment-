# Database Administrator (DBA) — Tesla Prime AI

Summary

Tesla Prime AI uses relational and analytical databases to power trading engines, portfolio analytics, and wallet services. This document describes the DBA responsibilities, points of contact, and where to find runbooks and operational procedures in the repository.

Primary responsibilities

- Ensure availability, performance, and security of production and staging databases.
- Manage schema design, migrations, and versioning.
- Implement and validate backups, restores, and disaster recovery.
- Monitor replication, query performance, and storage health; remediate problems.
- Maintain access control, secrets rotation, and audit trails.
- Produce runbooks for operational incidents and participate on-call.

Contact & on-call

- Primary DBA: TBD
- Pager: TBD
- Communication channel: #ops-dba (Slack)

Repository locations

- docs/DBA/ — runbooks, monitoring, backups, and security.
- schema/ — canonical ER diagrams and table descriptions (if present).
- migrations/ — repository of DB migrations and migration tooling guidance.

SLA & SLOs (examples)

- RTO (restore time objective): 2 hours for major incidents.
- RPO (data loss tolerance): < 5 minutes for critical transactional data (WAL archiving/replication required).
- Alert-to-acknowledge: 15 minutes during business hours.

Revision history

- v1.0: Initial creation — automated by repository docs update.
