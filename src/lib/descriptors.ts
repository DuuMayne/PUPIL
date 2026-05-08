/**
 * Control-specific CMMI level descriptors.
 * For each NIST CSF 2.0 subcategory, describes what systems, processes,
 * or procedures need to be in place to achieve each maturity level (1–5).
 */
export const CONTROL_DESCRIPTORS: Record<string, Record<1 | 2 | 3 | 4 | 5, string>> = {

  // ── GV.OC – Organizational Context ────────────────────────────────────────

  'GV.OC-01': {
    1: 'No documented organizational mission; cybersecurity decisions are made in isolation without any mission context.',
    2: 'Mission statement exists but is inconsistently referenced; some cybersecurity decisions consider mission impacts reactively.',
    3: 'Mission formally documented and communicated; cybersecurity risk management strategy explicitly aligns to mission priorities; risk owners understand mission-critical processes.',
    4: 'Quantitative objectives link mission outcomes to cybersecurity risk thresholds; mission impact analysis embedded in all risk assessments.',
    5: 'Continuous feedback loop between mission evolution and cybersecurity strategy; proactive adaptation as mission changes.',
  },

  'GV.OC-02': {
    1: 'No formal identification of internal or external stakeholders; cybersecurity expectations are unknown.',
    2: 'Key stakeholders identified reactively; expectations gathered informally or only upon request.',
    3: 'Stakeholder register maintained; expectations formally gathered, documented, and communicated to security leadership; regular engagement touchpoints scheduled.',
    4: 'Stakeholder satisfaction measured quantitatively; expectations tracked against delivery with defined commitments.',
    5: 'Continuous stakeholder engagement process; feedback loops drive proactive adjustments to cybersecurity programs.',
  },

  'GV.OC-03': {
    1: 'No systematic tracking of legal or regulatory requirements; compliance is entirely ad hoc or reactive.',
    2: 'Key regulatory requirements identified and documented; compliance reviewed reactively when requirements change or audits occur.',
    3: 'Regulatory and contractual requirements tracked in a register; mapped to controls; reviewed on a defined cadence; legal and compliance teams actively engaged.',
    4: 'Compliance posture measured quantitatively; control coverage tracked against requirements; gap metrics reported to leadership.',
    5: 'Proactive monitoring of emerging regulations; automated compliance tracking; continuous regulatory horizon scanning.',
  },

  'GV.OC-04': {
    1: 'Critical business processes and capabilities not formally identified; security priorities not tied to business impact.',
    2: 'Key business processes identified informally; some security resources allocated to critical systems reactively.',
    3: 'Business impact analysis (BIA) documented; critical assets and processes formally prioritized; CISO and business owners aligned on criticality tiers.',
    4: 'Criticality tiers quantitatively weighted; security investment and SLAs directly tied to criticality scores.',
    5: 'Dynamic BIA process continuously updated; automated criticality scoring integrated with asset management and risk tools.',
  },

  'GV.OC-05': {
    1: 'External dependencies (SaaS, cloud, vendors) not inventoried; reliance on third parties not considered in risk decisions.',
    2: 'Key vendors and external services identified; critical dependencies documented for major systems.',
    3: 'Comprehensive dependency register maintained; each dependency evaluated for availability, security, and substitutability; integrated into risk assessments.',
    4: 'Dependency health monitored quantitatively; SLA coverage, resilience metrics, and concentration risk tracked.',
    5: 'Proactive dependency risk management; continuous monitoring; redundancy and exit strategies tested regularly.',
  },

  // ── GV.RM – Risk Management Strategy ──────────────────────────────────────

  'GV.RM-01': {
    1: 'No formally stated risk management objectives; security activities are entirely reactive.',
    2: 'Risk management objectives exist informally or at team level; not formally agreed to by leadership.',
    3: 'Documented risk management objectives approved by executive leadership; communicated across the organization; tied to business objectives.',
    4: 'Objectives include quantitative targets (e.g., risk reduction percentages, ALE thresholds); performance measured against objectives.',
    5: 'Objectives continuously refined based on threat landscape, business changes, and program performance data.',
  },

  'GV.RM-02': {
    1: 'No formal risk appetite or tolerance; decisions made case-by-case with no guiding principles.',
    2: 'Risk appetite informally understood; some decisions reference it but not formally documented.',
    3: 'Risk appetite and tolerance formally documented, approved by board or executive leadership, and communicated to all risk owners.',
    4: 'Risk tolerance thresholds quantitatively defined; risk register items tagged against tolerance levels; threshold breaches automatically escalated.',
    5: 'Risk appetite dynamically adjusted based on business context, threat intelligence, and quantitative risk modeling.',
  },

  'GV.RM-03': {
    1: 'Cybersecurity risk managed in a silo; not reported to enterprise risk management (ERM).',
    2: 'Cybersecurity risk occasionally reported to ERM; integration informal or ad hoc.',
    3: 'Cybersecurity risk formally integrated into ERM processes; common risk taxonomy; regular reporting to enterprise risk committee.',
    4: 'Cybersecurity risk quantified in financial terms (e.g., ALE); integrated into enterprise risk dashboards.',
    5: 'Full ERM integration; cybersecurity risk modeled alongside operational, financial, and strategic risks with unified metrics.',
  },

  'GV.RM-04': {
    1: 'No policy or guidance on how to respond to identified risks; responses are ad hoc.',
    2: 'Some documented guidance on risk response options (accept, mitigate, transfer, avoid); applied inconsistently.',
    3: 'Formal risk response strategy documented and communicated; options defined with selection criteria; decision authority clear.',
    4: 'Risk response selection guided by quantitative cost-benefit analysis; response effectiveness tracked.',
    5: 'Risk response strategy continuously optimized based on outcomes; threat intelligence integrated into response guidance.',
  },

  'GV.RM-05': {
    1: 'No defined escalation paths for cybersecurity risk; information siloed within teams.',
    2: 'Informal communication channels exist; some risks escalated to leadership ad hoc.',
    3: 'Defined escalation paths documented; risk owners, CISO, and executive leadership have defined channels; third-party risk communication processes established.',
    4: 'Communication effectiveness measured; escalation SLAs defined and tracked.',
    5: 'Automated risk communication workflows; proactive notifications integrated with risk management platforms.',
  },

  'GV.RM-06': {
    1: 'No standard risk calculation methodology; risks assessed subjectively or not at all.',
    2: 'Basic risk methodology exists (likelihood × impact); used inconsistently across teams.',
    3: 'Formal risk methodology (e.g., FAIR, qualitative matrix) documented, trained on, and applied consistently across the organization.',
    4: 'Quantitative risk methodology (e.g., Monte Carlo, FAIR) used; risks expressed in financial terms; calibration reviews conducted.',
    5: 'Risk methodology continuously improved based on outcomes; automated tooling; benchmarked against industry standards.',
  },

  'GV.RM-07': {
    1: 'Only negative risks discussed; opportunities never surfaced in risk processes.',
    2: 'Positive risks occasionally mentioned informally; no formal framework.',
    3: 'Opportunity identification formally incorporated into risk management processes; risk register includes positive risk entries.',
    4: 'Opportunities quantitatively evaluated alongside threats; ROI analysis applied to risk acceptance decisions.',
    5: 'Opportunity-driven risk management; continuous scanning for strategic security-enabling opportunities.',
  },

  // ── GV.RR – Roles, Responsibilities, and Authorities ──────────────────────

  'GV.RR-01': {
    1: 'Leadership not formally accountable for cybersecurity risk; security viewed as purely a technical issue.',
    2: 'CISO or equivalent exists; some leadership engagement in security decisions; accountability informal.',
    3: 'Executive leadership formally accountable for cybersecurity; board-level reporting established; culture of security responsibility actively promoted.',
    4: 'Leadership accountability tied to performance metrics; security objectives included in executive scorecards.',
    5: 'Security-forward culture embedded at all levels; leadership proactively champions security; culture metrics tracked and improved.',
  },

  'GV.RR-02': {
    1: 'No formal RACI or role definitions for cybersecurity; responsibilities unclear or overlapping.',
    2: 'Key roles defined informally; some documentation exists but inconsistently applied.',
    3: 'Formal RACI matrix documented and communicated; roles for security operations, incident response, risk, and compliance clearly defined and staffed.',
    4: 'Role performance measured; accountability tracked; staffing gaps quantified and remediation planned.',
    5: 'Dynamic role definitions updated continuously; workforce planning integrated with threat landscape changes.',
  },

  'GV.RR-03': {
    1: 'Cybersecurity budget and staffing are ad hoc; security competes for resources with no formal process.',
    2: 'Basic cybersecurity budget exists; staffing informal; resource allocation reactive.',
    3: 'Cybersecurity budget formally tied to risk strategy; headcount and tooling requirements documented; reviewed at minimum annually.',
    4: 'Resource sufficiency measured quantitatively against risk exposure; budget decisions driven by risk metrics.',
    5: 'Continuous resource optimization; tool efficiency measured; budget allocation dynamically tied to risk posture.',
  },

  'GV.RR-04': {
    1: 'HR processes (hiring, onboarding, offboarding) not integrated with cybersecurity; access provisioning and termination ad hoc.',
    2: 'Basic background checks performed; offboarding includes some access revocation but inconsistently.',
    3: 'Security screening in hiring; cybersecurity responsibilities in job descriptions; formal onboarding security training; timely access revocation on termination.',
    4: 'HR-security process performance measured; time-to-offboard tracked; background check coverage metrics maintained.',
    5: 'Continuous improvement of HR-security integration; automated offboarding triggers; security culture metrics tracked.',
  },

  // ── GV.PO – Policy ─────────────────────────────────────────────────────────

  'GV.PO-01': {
    1: 'No formal cybersecurity policy; practices vary widely by team.',
    2: 'Basic cybersecurity policy exists but is outdated, incomplete, or not widely known.',
    3: 'Comprehensive cybersecurity policy documented, approved by leadership, communicated to all staff, and enforceable.',
    4: 'Policy compliance measured; exceptions tracked; enforcement metrics reported to leadership.',
    5: 'Policy continuously aligned with emerging threats and regulatory changes; feedback loops from incidents drive policy updates.',
  },

  'GV.PO-02': {
    1: 'Policy never or rarely reviewed; reflects outdated requirements and practices.',
    2: 'Policy reviewed reactively (e.g., after incidents or audits).',
    3: 'Formal policy review cycle (at minimum annually); change triggers documented; version control maintained; stakeholder review process established.',
    4: 'Policy effectiveness measured through compliance metrics and incident correlation; data-driven review cadence.',
    5: 'Continuous policy management; automated triggers from threat intel, regulatory changes, and incident trends drive proactive updates.',
  },

  // ── GV.OV – Oversight ──────────────────────────────────────────────────────

  'GV.OV-01': {
    1: 'No formal review of cybersecurity strategy outcomes; strategy set and forgotten.',
    2: 'Outcomes reviewed informally or reactively; no structured process.',
    3: 'Formal periodic review (e.g., quarterly) of risk management strategy outcomes; findings inform adjustments; results documented.',
    4: 'Outcome metrics defined; performance measured against targets; adjustments data-driven.',
    5: 'Continuous monitoring of strategy effectiveness; automated dashboards; proactive strategic adjustments.',
  },

  'GV.OV-02': {
    1: 'Risk management strategy not reviewed or adjusted; entirely static.',
    2: 'Strategy adjusted reactively in response to major incidents or regulatory changes.',
    3: 'Scheduled strategy reviews with defined inputs (threat landscape, business changes, program metrics); formal adjustment process.',
    4: 'Strategy adjustments tied to quantitative performance data; scenario-based strategy stress testing.',
    5: 'Dynamic strategy management with continuous environmental scanning and automated adjustment triggers.',
  },

  'GV.OV-03': {
    1: 'No performance evaluation; no KPIs or KRIs for the cybersecurity program.',
    2: 'Basic performance metrics exist informally; reviewed inconsistently.',
    3: 'Defined KPIs and KRIs for cybersecurity program; regularly reported to leadership; benchmarked against prior periods.',
    4: 'Quantitative performance targets with statistical process control; leading and lagging indicators tracked.',
    5: 'Continuous performance improvement culture; benchmarked against industry peers; automated performance dashboards.',
  },

  // ── GV.SC – Cybersecurity Supply Chain Risk Management ────────────────────

  'GV.SC-01': {
    1: 'No supply chain risk management program; vendor security not considered.',
    2: 'Basic vendor security reviews conducted ad hoc; no formal program.',
    3: 'Formal SCRM program with documented policies, procedures, objectives, and governance; stakeholder buy-in established.',
    4: 'SCRM program performance measured; vendor risk scores tracked; program effectiveness metrics reported.',
    5: 'Continuous improvement of SCRM; automated vendor monitoring; benchmarked against industry.',
  },

  'GV.SC-02': {
    1: 'Supplier cybersecurity responsibilities not defined or communicated.',
    2: 'Some suppliers have security expectations communicated informally.',
    3: 'Security roles and responsibilities formally defined in vendor agreements; internal ownership of supplier relationships documented.',
    4: 'Supplier security responsibilities tracked and enforced; performance metrics included in vendor management.',
    5: 'Continuous refinement of supplier security requirements based on threat landscape and incident data.',
  },

  'GV.SC-03': {
    1: 'Supply chain risk managed separately from enterprise risk; no integration.',
    2: 'Supplier risks occasionally reported to enterprise risk; integration informal.',
    3: 'Supply chain risk formally integrated into ERM; common risk taxonomy; regular reporting to enterprise risk committee.',
    4: 'Supply chain risk quantified and included in enterprise risk dashboards with financial exposure.',
    5: 'Fully integrated SCRM and ERM; real-time supply chain risk visibility; automated escalation.',
  },

  'GV.SC-04': {
    1: 'No supplier inventory; unknown who provides critical services.',
    2: 'Key suppliers identified informally; criticality not formally assessed.',
    3: 'Comprehensive supplier inventory maintained; suppliers classified by criticality with documented criteria.',
    4: 'Criticality scores quantitatively weighted; security investment proportional to criticality tiers.',
    5: 'Dynamic supplier criticality management; continuous reassessment as relationships and dependencies evolve.',
  },

  'GV.SC-05': {
    1: 'Vendor contracts contain no security requirements or right-to-audit clauses.',
    2: 'Some vendor contracts include basic security language; inconsistently applied.',
    3: 'Standard security requirements template used in all vendor contracts; right-to-audit, incident notification, breach liability, and data protection clauses standard.',
    4: 'Contract security requirements tracked; compliance verified; non-conformance rates measured.',
    5: 'Security contract requirements continuously updated to reflect emerging risks; automated contract clause management.',
  },

  'GV.SC-06': {
    1: 'No security due diligence before engaging suppliers; vendors onboarded without security review.',
    2: 'Basic security review for some vendors; process ad hoc.',
    3: 'Formal security due diligence process for all critical and high-risk suppliers; documented criteria, assessment templates, and approval gates.',
    4: 'Due diligence outcomes tracked; supplier risk scores influence contracting decisions quantitatively.',
    5: 'Continuous due diligence improvement; threat-informed assessment criteria; automated risk scoring at onboarding.',
  },

  'GV.SC-07': {
    1: 'Supplier risks not monitored after onboarding; set-and-forget vendor relationships.',
    2: 'Supplier risks reviewed reactively after incidents or contract renewals.',
    3: 'Ongoing supplier risk monitoring program; periodic reassessment on defined cadence; material changes trigger re-evaluation.',
    4: 'Supplier risk scores continuously monitored; automated alerts for threshold breaches; financial exposure tracked.',
    5: 'Real-time supplier risk monitoring; threat intelligence integrated; automated response to supplier security events.',
  },

  'GV.SC-08': {
    1: 'Suppliers excluded from incident response planning; coordination during incidents ad hoc.',
    2: 'Key suppliers contacted reactively during major incidents.',
    3: 'Supplier incident communication plans documented; contact lists maintained; joint tabletop exercises conducted.',
    4: 'Supplier incident response coordination measured; escalation time and effectiveness tracked.',
    5: 'Fully integrated supplier incident response; automated notification workflows; continuous improvement from joint exercises.',
  },

  'GV.SC-09': {
    1: 'No monitoring of supplier security practices after contract signing.',
    2: 'Periodic reviews conducted informally at contract renewal.',
    3: 'Supplier security performance monitored through defined cadence assessments, questionnaires, and certification reviews throughout the relationship.',
    4: 'Continuous supplier security monitoring with quantitative scorecards; automated alerts on posture changes.',
    5: 'Real-time supply chain security visibility; automated monitoring platforms; continuous improvement programs with suppliers.',
  },

  'GV.SC-10': {
    1: 'No provisions for winding down supplier relationships; data return and access revocation ad hoc.',
    2: 'Basic offboarding checklist exists; applied inconsistently.',
    3: 'Formal supplier offboarding process: data return/destruction requirements, access revocation, certification of completion, documentation retention.',
    4: 'Offboarding completeness measured; time-to-offboard tracked; verification audits conducted.',
    5: 'Automated offboarding workflows; continuous improvement based on post-relationship risk assessments.',
  },

  // ── ID.AM – Asset Management ───────────────────────────────────────────────

  'ID.AM-01': {
    1: 'No hardware inventory; physical assets largely unknown.',
    2: 'Partial hardware inventory maintained manually; not consistently updated.',
    3: 'Comprehensive hardware inventory maintained with defined fields (owner, location, classification, lifecycle state); updated through formal processes and reviewed regularly.',
    4: 'Hardware inventory accuracy measured; automated discovery validates against records; coverage metrics tracked.',
    5: 'Real-time hardware asset management; automated discovery integrated with CMDB; continuous reconciliation.',
  },

  'ID.AM-02': {
    1: 'No software or SaaS inventory; shadow IT unknown.',
    2: 'Partial software inventory for major applications; SaaS not tracked.',
    3: 'Comprehensive software and SaaS inventory maintained; includes installed software, licensed applications, and externally hosted services; ownership assigned.',
    4: 'Software inventory continuously reconciled against discovery scans; license compliance and shadow IT metrics tracked.',
    5: 'Real-time software asset management; automated discovery; continuous compliance monitoring.',
  },

  'ID.AM-03': {
    1: 'No network diagrams or data flow documentation.',
    2: 'Basic network diagrams exist but outdated; data flows not documented.',
    3: 'Accurate network topology diagrams and data flow maps maintained; internal and external data flows documented; reviewed annually and on significant change.',
    4: 'Network communications validated against authoritative records; unauthorized flows detected; accuracy metrics tracked.',
    5: 'Dynamic network mapping; automated topology discovery; continuous validation of authorized communication patterns.',
  },

  'ID.AM-04': {
    1: 'No inventory of services provided by suppliers; dependencies unknown.',
    2: 'Key vendor services informally known; not formally documented.',
    3: 'Comprehensive inventory of supplier services with criticality, data classification, and contractual details; integrated with SCRM program.',
    4: 'Supplier service inventory accuracy measured; automated discovery of new dependencies; coverage metrics tracked.',
    5: 'Real-time supplier service visibility; automated inventory management; integrated with contract and risk management systems.',
  },

  'ID.AM-05': {
    1: 'All assets treated equally; no prioritization based on criticality or business impact.',
    2: 'Critical systems informally identified; prioritization ad hoc.',
    3: 'Formal asset classification scheme (criticality tiers) applied consistently; BIA drives classification; security controls tiered accordingly.',
    4: 'Classification accuracy measured; asset criticality scores quantitatively derived; misclassification rates tracked.',
    5: 'Dynamic criticality scoring; continuously updated based on business context; automated risk alignment to criticality tiers.',
  },

  'ID.AM-07': {
    1: 'No data inventory; data types, locations, and ownership unknown.',
    2: 'Partial data inventory for known sensitive data types; metadata not systematically captured.',
    3: 'Comprehensive data inventory with classification, location, owner, retention requirements, and regulatory applicability; reviewed regularly.',
    4: 'Data inventory completeness measured; data discovery scans validate inventory; classification accuracy tracked.',
    5: 'Real-time data discovery and classification; automated metadata management; continuous compliance with data governance policies.',
  },

  'ID.AM-08': {
    1: 'No lifecycle management; assets procured, used, and decommissioned ad hoc.',
    2: 'Basic lifecycle tracking for major systems; decommissioning informal.',
    3: 'Formal lifecycle management process covering procurement, deployment, maintenance, and decommissioning; security requirements at each stage; decommissioning includes data sanitization and certificate revocation.',
    4: 'Lifecycle compliance measured; unauthorized end-of-life assets tracked; mean time in lifecycle stages reported.',
    5: 'Automated lifecycle management; continuous monitoring of EOL status; proactive decommissioning planning.',
  },

  // ── ID.RA – Risk Assessment ────────────────────────────────────────────────

  'ID.RA-01': {
    1: 'No vulnerability management program; vulnerabilities identified reactively or not at all.',
    2: 'Periodic vulnerability scanning on some assets; findings informally tracked.',
    3: 'Comprehensive vulnerability scanning program covering all assets; findings tracked in a vulnerability management system; ownership assigned; remediation timelines defined.',
    4: 'Vulnerability metrics tracked (MTTR, SLA compliance, risk-based prioritization); trending reported to leadership.',
    5: 'Continuous vulnerability monitoring; automated discovery; intelligence-driven prioritization; proactive zero-day response capability.',
  },

  'ID.RA-02': {
    1: 'No threat intelligence program; no participation in information sharing forums.',
    2: 'Some threat feeds subscribed to informally; not systematically acted upon.',
    3: 'Formal threat intelligence program; participation in ISACs, government feeds (CISA, FBI), and commercial threat intel; intel actioned and tracked.',
    4: 'Threat intelligence effectiveness measured; intel-to-action time tracked; coverage of relevant threat actors measured.',
    5: 'Threat intelligence fully integrated with detection and response tools; automated intel ingestion; active contribution to sharing communities.',
  },

  'ID.RA-03': {
    1: 'No formal threat identification process; threats not documented.',
    2: 'Threats identified reactively or in response to specific incidents; informal documentation.',
    3: 'Formal threat modeling (e.g., STRIDE, FAIR) applied to assets and systems; threats documented with likelihood and impact assessments; threat register maintained.',
    4: 'Threat register continuously updated; threats quantitatively assessed; coverage metrics tracked.',
    5: 'Continuous threat identification; automated threat detection integrated with threat register; proactive threat hunting.',
  },

  'ID.RA-04': {
    1: 'Risk assessments not conducted; likelihood and impact not formally considered.',
    2: 'Informal likelihood and impact estimates; not consistently documented.',
    3: 'Formal risk assessment methodology applied; likelihood and impact documented for identified risks; assessments reviewed periodically.',
    4: 'Quantitative likelihood and impact assessments (e.g., FAIR, Monte Carlo); statistical confidence in estimates tracked.',
    5: 'Continuous risk assessment updates; automated data collection for likelihood estimates; impact modeling using business data.',
  },

  'ID.RA-05': {
    1: 'Risks not tracked or prioritized; responses based on urgency or visibility rather than risk.',
    2: 'Some risk prioritization informally; highest-visibility risks addressed first.',
    3: 'Risk register with formal prioritization criteria; risk-based roadmap drives remediation efforts; risk register reviewed regularly with stakeholders.',
    4: 'Risk prioritization driven by quantitative risk scores; resource allocation tied to risk reduction ROI.',
    5: 'Continuous risk-informed prioritization; automated risk scoring; dynamic resource allocation based on risk posture.',
  },

  'ID.RA-06': {
    1: 'Risks identified but responses not tracked; remediation status unknown.',
    2: 'Risk responses informally tracked in spreadsheets or email.',
    3: 'Formal risk treatment plan; each risk has a documented response (accept, mitigate, transfer, avoid), owner, and deadline; tracked in a risk management system.',
    4: 'Risk treatment effectiveness measured; risk reduction achieved vs. planned; exceptions and overdue items automatically escalated.',
    5: 'Continuous risk treatment optimization; closed-loop tracking; automated escalation and reporting.',
  },

  'ID.RA-07': {
    1: 'Changes deployed without security review; exceptions not formally managed.',
    2: 'Major changes reviewed for security informally; exceptions handled ad hoc.',
    3: 'Formal change management process includes security review gate; exception management process with risk acceptance documentation and approval.',
    4: 'Change risk metrics tracked; exception aging and risk exposure quantified; change-related incident rates measured.',
    5: 'Automated risk scoring for changes; continuous exception monitoring; proactive exception reduction programs.',
  },

  'ID.RA-08': {
    1: 'No vulnerability disclosure program; external reports have no formal intake path.',
    2: 'Informal process for receiving vulnerability reports; responses ad hoc.',
    3: 'Formal vulnerability disclosure policy published; clear intake path (security@ address or form); response SLAs defined; acknowledgment and tracking in place.',
    4: 'Disclosure program metrics tracked (time to acknowledge, time to remediate); bug bounty program if applicable.',
    5: 'Mature vulnerability disclosure program; proactive researcher engagement; CVE coordination capability; continuous program improvement.',
  },

  'ID.RA-09': {
    1: 'No verification of software or hardware authenticity before acquisition.',
    2: 'Basic vendor verification for some acquisitions; inconsistent.',
    3: 'Formal procurement security process; software signed and verified; hardware sourced from approved vendors; SBOM or provenance documentation required for critical systems.',
    4: 'Supply chain authenticity verification coverage measured; automated integrity checking for software deployments.',
    5: 'Advanced supply chain integrity controls; continuous provenance monitoring; automated attestation verification.',
  },

  'ID.RA-10': {
    1: 'No security assessment of suppliers before engagement.',
    2: 'Some suppliers assessed informally for major contracts.',
    3: 'Formal pre-acquisition security assessment for all critical suppliers; standardized questionnaire and review process; risk acceptance documented.',
    4: 'Pre-acquisition assessment results tracked; supplier risk scores influence commercial decisions; assessment coverage measured.',
    5: 'Continuous supplier security assessment improvement; automated assessment tools; benchmarked assessment criteria.',
  },

  // ── ID.IM – Improvement ────────────────────────────────────────────────────

  'ID.IM-01': {
    1: 'No formal evaluation process; improvements not systematically identified.',
    2: 'Improvements identified reactively from audits or incidents; tracking informal.',
    3: 'Formal evaluation program (internal audits, assessments, reviews); improvement items documented, owned, and tracked to closure.',
    4: 'Improvement identification rate and closure rate measured; evaluation effectiveness quantified.',
    5: 'Continuous improvement culture; automated tracking; lessons learned integrated into future evaluations.',
  },

  'ID.IM-02': {
    1: 'No security testing or exercises conducted.',
    2: 'Occasional penetration tests or tabletop exercises; findings informally tracked.',
    3: 'Regular security testing program (pen tests, red team, tabletops, phishing simulations); findings formally tracked; remediation owners and timelines defined.',
    4: 'Testing frequency and coverage measured; remediation closure rates tracked; test findings drive program improvements.',
    5: 'Continuous testing program; purple team exercises; automated adversary simulation; continuous improvement of test methodology.',
  },

  'ID.IM-03': {
    1: 'Operational insights not captured; process failures repeated without corrective action.',
    2: 'Some lessons learned captured informally; not systematically applied.',
    3: 'Formal process for capturing operational improvements; after-action reviews conducted; process owners responsible for implementing improvements.',
    4: 'Operational improvement metrics tracked; process efficiency and error rates measured; improvement velocity tracked.',
    5: 'Continuous process improvement program; automated anomaly detection drives process reviews; benchmarked against best practices.',
  },

  'ID.IM-04': {
    1: 'No incident response plan; responses entirely ad hoc.',
    2: 'Basic IR plan exists; not regularly tested or updated.',
    3: 'Comprehensive IR plan documented, approved, communicated, and tested at least annually; covers detection, containment, eradication, recovery, and lessons learned.',
    4: 'IR plan effectiveness measured through exercises; metrics include MTTD, MTTR, containment time; gaps drive plan updates.',
    5: 'Continuously evolving IR plan; informed by threat intelligence, exercise outcomes, and incident data; automated IR playbooks via SOAR.',
  },

  // ── PR.AA – Identity Management, Authentication, and Access Control ────────

  'PR.AA-01': {
    1: 'No formal identity management; accounts created ad hoc; orphan accounts common.',
    2: 'Basic user provisioning process; some deprovisioning but inconsistent; no formal IAM program.',
    3: 'Formal IAM program with defined provisioning/deprovisioning processes, access request workflows, regular access reviews (at minimum quarterly), and privileged access management.',
    4: 'IAM metrics tracked (orphan accounts, access review completion, provisioning SLA); automated access reviews.',
    5: 'Continuous identity governance; automated lifecycle management; behavior analytics; just-in-time access.',
  },

  'PR.AA-02': {
    1: 'No identity proofing; accounts created with minimal verification.',
    2: 'Basic identity verification for employees; contractors and third parties not consistently proofed.',
    3: 'Formal identity proofing process commensurate with access level; credential binding policies documented; elevated proofing for privileged access.',
    4: 'Identity proofing assurance levels measured against access risk; anomalies detected and investigated.',
    5: 'Continuous identity assurance; adaptive proofing based on risk signals; advanced credential binding for critical access.',
  },

  'PR.AA-03': {
    1: 'Passwords only, often weak; shared credentials common; no MFA anywhere.',
    2: 'Password policies exist but inconsistently enforced; MFA deployed for some systems.',
    3: 'MFA required for all remote access and privileged accounts; password policies technically enforced; service accounts use certificates or managed secrets; hardware uses certificates.',
    4: 'Authentication coverage measured; MFA adoption rate tracked; authentication failures monitored with alerting thresholds.',
    5: 'Phishing-resistant MFA (FIDO2/passkeys) for all users; passwordless authentication; continuous authentication risk signals.',
  },

  'PR.AA-04': {
    1: 'No protection of authentication tokens or assertions; session hijacking risks unaddressed.',
    2: 'HTTPS used for most systems; token management informal.',
    3: 'Secure token management (signed JWTs, short-lived tokens, token revocation); federation uses signed assertions (SAML/OIDC); session management policies enforced.',
    4: 'Token security metrics tracked; assertion integrity verified; anomalous token usage alerted.',
    5: 'Continuous token and assertion security monitoring; automated revocation on anomaly detection; zero-trust token validation.',
  },

  'PR.AA-05': {
    1: 'Access permissions uncontrolled; no least privilege; permissions accumulate over time without review.',
    2: 'Basic access control; some role definitions; permissions reviewed reactively.',
    3: 'RBAC implemented; least privilege enforced; formal access review process conducted at least quarterly; access requests require business justification.',
    4: 'Access review completion rates tracked; over-privileged accounts identified and remediated; access risk scores quantified.',
    5: 'Continuous access governance; automated entitlement intelligence; just-in-time access; AI-assisted access anomaly detection.',
  },

  'PR.AA-06': {
    1: 'Physical access uncontrolled; no logs of who accesses sensitive areas.',
    2: 'Basic physical access controls (badge access) for main facilities; inconsistent monitoring.',
    3: 'Physical access controls for all sensitive areas; access logs maintained; badge access tied to least privilege; visitor management process; CCTV where appropriate.',
    4: 'Physical access logs monitored; anomalies investigated; physical access audit coverage measured.',
    5: 'Continuous physical access monitoring; automated anomaly detection; integration of physical and logical access controls.',
  },

  // ── PR.AT – Awareness and Training ────────────────────────────────────────

  'PR.AT-01': {
    1: 'No security awareness program; employees not trained on security basics.',
    2: 'Annual security awareness training exists but mandatory completion inconsistent; one-size-fits-all content.',
    3: 'Mandatory annual security awareness training with role-appropriate modules; phishing simulation program; completion rates tracked and enforced; content updated regularly.',
    4: 'Training effectiveness measured (phishing click rates, quiz scores, incident correlation); completion rates ≥95%; targeted retraining for high-risk users.',
    5: 'Continuous awareness program; adaptive training based on behavior signals; gamified security culture; measurable risk reduction from training demonstrated.',
  },

  'PR.AT-02': {
    1: 'Security and IT staff receive no specialized security training beyond general awareness.',
    2: 'Some specialized training ad hoc; certifications encouraged but not required.',
    3: 'Role-specific training requirements defined (e.g., SANS courses for SOC, CISSP for architects, developer secure coding); completion tracked; training budgets allocated per role.',
    4: 'Specialized training effectiveness measured; role certification coverage tracked; skill gap metrics reported.',
    5: 'Continuous specialized training programs; internal knowledge sharing; advanced simulations for red/blue teams; skills tied to career development.',
  },

  // ── PR.DS – Data Security ──────────────────────────────────────────────────

  'PR.DS-01': {
    1: 'Data stored unencrypted; no data classification enforced at the storage layer.',
    2: 'Some sensitive data encrypted at rest (e.g., databases); encryption ad hoc and inconsistent.',
    3: 'Encryption-at-rest policy enforced for all classified data; encryption standards documented (e.g., AES-256); key management process defined; coverage verified.',
    4: 'Encryption coverage measured; key rotation compliance tracked; unencrypted sensitive data incidents tracked.',
    5: 'Continuous encryption posture monitoring; automated key management; data-at-rest compliance integrated with data governance.',
  },

  'PR.DS-02': {
    1: 'Data transmitted in cleartext; TLS not consistently used.',
    2: 'TLS used for customer-facing systems; internal traffic often unencrypted.',
    3: 'TLS enforced for all data-in-transit; minimum TLS version policy (TLS 1.2+); certificate management process; internal service-to-service encryption (mTLS where appropriate).',
    4: 'TLS configuration coverage measured; certificate expiry monitoring; protocol compliance tracked.',
    5: 'Zero-trust network with mTLS everywhere; automated certificate lifecycle management; continuous TLS posture monitoring.',
  },

  'PR.DS-10': {
    1: 'No controls for data in active processing; sensitive data visible in logs, errors, and memory.',
    2: 'Basic access controls limit who can access data in use; no memory protection or secure enclaves.',
    3: 'Access controls enforce least privilege for data processing; sensitive data masked in non-production environments; secure development practices prevent data exposure in logs or error messages.',
    4: 'Data-in-use exposure incidents tracked; memory protection coverage measured; non-production data masking compliance verified.',
    5: 'Advanced data-in-use protection; confidential computing where applicable; continuous monitoring for data exposure in processing.',
  },

  'PR.DS-11': {
    1: 'No formal backup program; data recovery untested.',
    2: 'Backups exist for some systems; restoration rarely tested; backup security not considered.',
    3: 'Comprehensive backup program covering all critical data; backups encrypted and stored offline or off-site; restoration tested at least annually; RPO and RTO defined.',
    4: 'Backup success rates measured; restoration test results tracked; RPO/RTO compliance measured; backup integrity verified.',
    5: 'Continuous backup validation; automated restoration testing; immutable backups; real-time RPO monitoring.',
  },

  // ── PR.PS – Platform Security ──────────────────────────────────────────────

  'PR.PS-01': {
    1: 'Systems deployed with default configurations; no hardening standards.',
    2: 'Basic hardening checklists exist for some platforms; applied inconsistently.',
    3: 'Configuration baselines (CIS Benchmarks or equivalent) defined for all system types; applied at deployment; configuration management tooling enforces standards; drift detection in place.',
    4: 'Configuration compliance measured continuously; drift rates tracked; non-compliant systems remediated within defined SLAs.',
    5: 'Continuous configuration compliance; automated remediation of drift; configuration management integrated with CI/CD pipelines.',
  },

  'PR.PS-02': {
    1: 'Outdated software common; patching irregular; EOL software in use without risk acceptance.',
    2: 'Patching program exists but applied inconsistently; some EOL software formally identified.',
    3: 'Formal patch management program; critical patches applied within defined SLAs (e.g., critical within 7 days); EOL software tracked and decommissioned or risk-accepted; patch compliance reported.',
    4: 'Patch SLA compliance measured; mean time to patch tracked; EOL coverage metrics; vulnerability-to-patch correlation.',
    5: 'Continuous patch management; automated patching pipelines; threat-intelligence-driven prioritization; near-zero EOL tolerance.',
  },

  'PR.PS-03': {
    1: 'Hardware replacement ad hoc; EOL hardware common; no lifecycle tracking.',
    2: 'Major hardware lifecycle tracked informally; some EOL hardware identified.',
    3: 'Hardware lifecycle program; EOL hardware inventoried and decommissioned on schedule; hardware sanitization procedures; maintenance contracts current.',
    4: 'Hardware EOL coverage measured; sanitization compliance tracked; mean time to replace tracked.',
    5: 'Proactive hardware lifecycle management; automated EOL alerting; continuous asset health monitoring.',
  },

  'PR.PS-04': {
    1: 'Minimal logging; logs not centrally collected; no retention policy.',
    2: 'Logs from key systems collected; retention informal; SIEM limited or absent.',
    3: 'Comprehensive logging standards (what to log, format, retention); centralized log aggregation (SIEM); log integrity protected; retention meets compliance requirements.',
    4: 'Log coverage measured; completeness tracked against standards; gaps remediated; log integrity verified.',
    5: 'Continuous log management; automated coverage assessment; behavioral analytics integrated; log completeness as a tracked security metric.',
  },

  'PR.PS-05': {
    1: 'No application control; users can install any software freely.',
    2: 'Software installation restricted for most users but enforced inconsistently; limited allowlisting.',
    3: 'Application allowlisting or strong software restriction policies enforced on all endpoints; unauthorized execution blocked; software approval process.',
    4: 'Unauthorized execution attempts measured; allowlist coverage tracked; policy violation rates reported.',
    5: 'Zero-trust application control; continuous behavioral monitoring for unauthorized execution; ML-based anomaly detection.',
  },

  'PR.PS-06': {
    1: 'No secure development lifecycle; security not considered during development.',
    2: 'Basic security code review for some applications; SAST/DAST ad hoc.',
    3: 'Formal SDLC with security gates; SAST/DAST in CI/CD pipeline; developer secure coding training; security requirements in design; penetration testing before production.',
    4: 'SDLC security metrics (vulnerability density, remediation time, security gate pass rate) tracked; regression rates measured.',
    5: 'Continuous security in development; automated security testing throughout pipeline; threat modeling tooling; developer security champions program.',
  },

  // ── PR.IR – Technology Infrastructure Resilience ──────────────────────────

  'PR.IR-01': {
    1: 'Flat network; no segmentation; all systems equally accessible to any internal user.',
    2: 'Basic perimeter firewall; limited internal segmentation.',
    3: 'Network segmentation by security zone; firewalls between zones; DMZ for external-facing systems; zero trust principles applied; ingress/egress filtering.',
    4: 'Network access control coverage measured; unauthorized access attempts tracked; segmentation effectiveness tested.',
    5: 'Zero trust network architecture; continuous network access monitoring; micro-segmentation; automated anomaly detection.',
  },

  'PR.IR-02': {
    1: 'No environmental controls; data centers at risk from power, temperature, water, and fire.',
    2: 'Basic environmental controls (UPS, HVAC) in primary data center; remote sites inconsistent.',
    3: 'Environmental controls (power redundancy, cooling, fire suppression, flood protection) in all data centers and server rooms; documented, tested, and monitored.',
    4: 'Environmental control performance measured; incident rates tracked; testing coverage metrics.',
    5: 'Continuous environmental monitoring; automated alerting; proactive capacity planning; resilience-by-design.',
  },

  'PR.IR-03': {
    1: 'No resilience planning; single points of failure throughout infrastructure.',
    2: 'Some redundancy for critical systems; business continuity planning informal.',
    3: 'Resilience requirements defined for critical systems (RTO/RPO); redundant components deployed; failover tested; disaster recovery plan documented.',
    4: 'Resilience metrics tracked (RTO/RPO achievement, failover success rates); SLA compliance measured.',
    5: 'Continuous resilience engineering; chaos engineering practices; automated failover; resilience integrated into all architecture decisions.',
  },

  'PR.IR-04': {
    1: 'No capacity planning; outages from resource exhaustion are common.',
    2: 'Basic capacity monitoring for critical systems; scaling reactive.',
    3: 'Formal capacity management program; thresholds and alerts defined; capacity reviews on defined cadence; auto-scaling where appropriate.',
    4: 'Capacity utilization and headroom tracked; predictive capacity planning using trend analysis.',
    5: 'Continuous capacity optimization; ML-driven capacity prediction; automated scaling; proactive rightsizing.',
  },

  // ── DE.CM – Continuous Monitoring ─────────────────────────────────────────

  'DE.CM-01': {
    1: 'No network monitoring; anomalies detected only when users report issues.',
    2: 'Basic network monitoring (availability/performance); limited security visibility.',
    3: 'Security-focused network monitoring (IDS/IPS, NetFlow, DNS monitoring); alerts for anomalous traffic; SIEM integration; coverage of all network segments.',
    4: 'Network monitoring coverage measured; detection rate and false positive rate tracked; MTTD from network events measured.',
    5: 'Continuous adaptive network monitoring; ML-based anomaly detection; automated response to network threats; full packet capture capability.',
  },

  'DE.CM-02': {
    1: 'No physical security monitoring; no CCTV or physical intrusion detection.',
    2: 'CCTV in main areas; badge access logs not regularly reviewed.',
    3: 'Physical monitoring covers all sensitive areas (server rooms, data centers, offices); logs reviewed regularly; physical intrusion detection systems in place.',
    4: 'Physical monitoring coverage measured; alert response times tracked; incident correlation between physical and logical events.',
    5: 'Integrated physical and logical security monitoring; automated anomaly detection; continuous review of physical access patterns.',
  },

  'DE.CM-03': {
    1: 'No monitoring of user activity; insider threats undetected.',
    2: 'Basic logging of authentication events; no behavior analysis.',
    3: 'User and Entity Behavior Analytics (UEBA) or equivalent; monitoring of privileged user activity; DLP for sensitive data access; anomaly alerting in place.',
    4: 'Insider threat detection metrics tracked; UEBA alert fidelity measured; investigation times reported.',
    5: 'Advanced insider threat detection; continuous behavioral baselining; automated response to high-confidence indicators; integrated with HR risk signals.',
  },

  'DE.CM-06': {
    1: 'Third-party and vendor activity not monitored.',
    2: 'Some logging of vendor remote access; not systematically reviewed.',
    3: 'Vendor access monitoring; privileged access management (PAM) for vendor sessions; vendor activity logs retained; anomalous vendor behavior alerted.',
    4: 'Vendor access metrics tracked; session recording coverage measured; anomaly detection rates reported.',
    5: 'Continuous vendor activity monitoring; automated session analysis; vendor risk scoring updated from behavioral data.',
  },

  'DE.CM-09': {
    1: 'Endpoint activity not monitored; malware detection only via reactive tools.',
    2: 'Antivirus on endpoints; limited endpoint telemetry; EDR on some systems.',
    3: 'EDR deployed on all endpoints; file integrity monitoring (FIM) on critical systems; runtime application monitoring; hardware health monitoring; all telemetry centralized.',
    4: 'Endpoint telemetry coverage measured; EDR alert fidelity tracked; FIM false positive rates managed.',
    5: 'XDR across all endpoints and workloads; continuous ML-based threat detection; automated containment on high-confidence detections.',
  },

  // ── DE.AE – Adverse Event Analysis ────────────────────────────────────────

  'DE.AE-02': {
    1: 'No analysis of security events; alerts ignored or reviewed only when critical.',
    2: 'Critical alerts reviewed; basic analysis performed; most events not investigated.',
    3: 'Formal security event analysis process; triage criteria defined; SOC analysts investigate all medium-and-above alerts; analysis documented.',
    4: 'Alert triage time and analysis quality measured; false positive rate tracked; analyst efficiency metrics.',
    5: 'Automated event analysis; AI-assisted investigation; continuous analyst skill development; feedback loops improve detection fidelity.',
  },

  'DE.AE-03': {
    1: 'Each alert analyzed in isolation; no correlation between data sources.',
    2: 'Manual correlation of related events by experienced analysts; inconsistent.',
    3: 'SIEM with correlation rules correlating events across log sources; threat intel integrated; alert grouping and deduplication in place.',
    4: 'Correlation rule coverage and effectiveness measured; correlation-to-incident conversion rate tracked.',
    5: 'Advanced automated correlation; ML-based threat detection; cross-source anomaly detection; graph-based attack path analysis.',
  },

  'DE.AE-04': {
    1: 'Impact and scope of events unknown until after-action review; entirely reactive.',
    2: 'Impact estimated informally during incident response; scope assessment inconsistent.',
    3: 'Structured impact and scope assessment process; blast radius analysis; affected asset identification; business impact quantified during investigation.',
    4: 'Impact assessment accuracy measured post-incident; scope expansion rates tracked; time to scope determination reported.',
    5: 'Automated impact modeling; real-time blast radius visualization; continuous improvement of impact assessment methodology.',
  },

  'DE.AE-06': {
    1: 'No defined process for distributing event information; knowledge siloed in SOC.',
    2: 'Key stakeholders notified of major incidents informally; distribution ad hoc.',
    3: 'Defined distribution lists for different event severities; automated notifications via SIEM/SOAR; escalation procedures documented; information classification applied.',
    4: 'Notification timeliness measured; stakeholder satisfaction tracked; escalation SLA compliance reported.',
    5: 'Automated, risk-tiered event distribution; proactive stakeholder communication; continuous notification effectiveness measurement.',
  },

  'DE.AE-07': {
    1: 'Threat intelligence not used during event analysis.',
    2: 'Analysts manually check threat feeds for some investigations.',
    3: 'Threat intelligence platform (TIP) integrated with SIEM; IOCs automatically enriched; analyst workflows include threat intel lookups; threat context included in alert documentation.',
    4: 'Threat intel integration coverage measured; IOC match rates tracked; time-to-intel measured.',
    5: 'Automated threat intelligence enrichment; ML-driven threat actor attribution; proactive hunting based on threat intel.',
  },

  'DE.AE-08': {
    1: 'No formal incident declaration criteria; incidents declared informally or not at all.',
    2: 'Informal criteria for what constitutes an incident; inconsistently applied.',
    3: 'Formal incident classification and declaration criteria documented and communicated; severity levels with defined response actions; declaration authority clear.',
    4: 'Incident declaration timeliness measured; false declaration rates tracked; criteria effectiveness reviewed.',
    5: 'Automated incident declaration triggers; continuous calibration of declaration criteria; proactive detection of pre-incident conditions.',
  },

  // ── RS.MA – Incident Management ───────────────────────────────────────────

  'RS.MA-01': {
    1: 'No IR plan executed; responses improvised.',
    2: 'IR plan referenced during incidents but not consistently followed; execution varies by responder.',
    3: 'IR plan consistently executed with documented roles, playbooks for common incident types, and communication trees; exercises validate execution.',
    4: 'IR plan execution metrics tracked (steps completed, time per phase); deviations documented and analyzed.',
    5: 'Automated playbook execution via SOAR; continuous IR plan refinement based on exercise and incident outcomes.',
  },

  'RS.MA-02': {
    1: 'Incidents not formally triaged; all reports handled equally regardless of severity.',
    2: 'Basic triage by senior analyst; process informal.',
    3: 'Formal triage process with defined criteria; all reports assessed within defined SLA; escalation path clear; false positives documented.',
    4: 'Triage accuracy and time measured; false positive rate tracked; triage SLA compliance reported.',
    5: 'Automated triage with ML assistance; continuous triage criteria optimization; automated false positive reduction.',
  },

  'RS.MA-03': {
    1: 'No incident categorization; all incidents treated the same.',
    2: 'Basic severity levels (low/medium/high) applied informally.',
    3: 'Formal incident taxonomy and severity matrix; incidents categorized by type and severity; categorization drives different response actions.',
    4: 'Categorization accuracy measured; category-to-response alignment tracked; prioritization consistency metrics.',
    5: 'Automated categorization; AI-assisted severity determination; continuous taxonomy refinement based on incident patterns.',
  },

  'RS.MA-04': {
    1: 'No escalation criteria; escalation ad hoc.',
    2: 'Senior staff escalated to informally based on analyst judgment.',
    3: 'Formal escalation criteria and escalation tree documented; time-based escalation triggers; executive notification thresholds defined; regulatory notification triggers.',
    4: 'Escalation timeliness measured; under- and over-escalation rates tracked.',
    5: 'Automated escalation workflows; intelligent escalation prediction; continuous calibration of escalation triggers.',
  },

  'RS.MA-05': {
    1: 'Recovery started arbitrarily; no criteria for when it is safe to recover.',
    2: 'Recovery initiated when "it seems safe" based on analyst judgment; criteria informal.',
    3: 'Formal recovery initiation criteria; sign-off from security, operations, and business leadership required; eradication confirmed before recovery; criteria documented in IR plan.',
    4: 'Recovery initiation compliance tracked; premature recovery incidents measured; criteria effectiveness evaluated.',
    5: 'Automated recovery readiness assessment; continuous monitoring during recovery; adaptive recovery criteria.',
  },

  // ── RS.AN – Incident Analysis ──────────────────────────────────────────────

  'RS.AN-03': {
    1: 'No root cause analysis; incidents resolved without understanding the cause.',
    2: 'Some post-incident analysis for major incidents; informal and inconsistent.',
    3: 'Formal post-incident review (PIR) for all significant incidents; root cause analysis methodology (5 Whys, fishbone) applied; findings documented and actioned.',
    4: 'PIR completion rates tracked; root cause categories analyzed for trends; time to root cause measured.',
    5: 'Advanced root cause analysis; ML-assisted pattern recognition; root causes drive strategic security improvements.',
  },

  'RS.AN-06': {
    1: 'Investigation actions not documented; chain of custody not maintained.',
    2: 'Basic investigation notes kept; forensic integrity not formally maintained.',
    3: 'All investigation actions logged with timestamps and actor identities; evidence handling procedures documented; chain of custody maintained; immutable logging for forensic preservation.',
    4: 'Investigation documentation completeness measured; chain of custody compliance tracked.',
    5: 'Automated investigation logging; digital chain of custody tools; continuous evidence integrity monitoring.',
  },

  'RS.AN-07': {
    1: 'Evidence collected haphazardly; data integrity not preserved; forensic value lost.',
    2: 'Key evidence collected informally; some integrity controls.',
    3: 'Formal evidence collection procedures; write blockers for disk imaging; hash verification; documented collection methodology; legal hold procedures where applicable.',
    4: 'Evidence collection compliance measured; integrity verification rates tracked.',
    5: 'Automated evidence collection tools; continuous integrity verification; integrated legal hold management.',
  },

  'RS.AN-08': {
    1: 'Incident magnitude unknown during response; impact discovered only after the fact.',
    2: 'Rough impact estimates made informally during response.',
    3: 'Formal magnitude estimation process; affected system scope, data exposure, and business impact quantified during investigation; estimates validated and updated as investigation progresses.',
    4: 'Magnitude estimation accuracy measured post-incident; estimation methodology continuously improved.',
    5: 'Real-time magnitude modeling; automated scope determination; continuous refinement of estimation models.',
  },

  // ── RS.CO – Incident Response Reporting and Communication ─────────────────

  'RS.CO-02': {
    1: 'No stakeholder notification process; leadership learns of incidents informally or late.',
    2: 'Key stakeholders notified informally; no defined timelines or templates.',
    3: 'Defined stakeholder notification lists by severity; notification templates; timelines meeting regulatory requirements; legal and compliance team engaged for reportable incidents.',
    4: 'Notification timeliness and completeness measured; regulatory notification SLA compliance tracked.',
    5: 'Automated stakeholder notification workflows; proactive communication; continuous regulatory requirement monitoring.',
  },

  'RS.CO-03': {
    1: 'Incident information not shared externally; no threat sharing.',
    2: 'Some information shared with law enforcement or ISACs informally and reactively.',
    3: 'Defined external sharing protocols; incident IOCs shared with ISAC, CISA, or law enforcement as appropriate; information classification applied; legal review for external sharing.',
    4: 'External sharing volume and timeliness tracked; sharing effectiveness measured.',
    5: 'Automated threat sharing; proactive IOC publication; active participation in threat intel communities.',
  },

  // ── RS.MI – Incident Mitigation ───────────────────────────────────────────

  'RS.MI-01': {
    1: 'No defined containment procedures; threat spreads during response.',
    2: 'Basic containment actions taken reactively (e.g., network block, account disable) without standardized procedures.',
    3: 'Formal containment playbooks for common incident types; containment actions documented; decision authority clear; containment effectiveness verified before eradication.',
    4: 'Containment time (MTTC) measured; containment failure rates tracked; playbook coverage measured.',
    5: 'Automated containment via SOAR; adaptive containment strategies; continuous containment effectiveness optimization.',
  },

  'RS.MI-02': {
    1: 'No eradication process; threats may persist after "resolution."',
    2: 'Basic eradication (delete malware, reset accounts) without verifying completeness.',
    3: 'Formal eradication procedures; IOC sweep to verify complete removal; system integrity validation; re-infection prevention measures applied.',
    4: 'Eradication completeness measured; re-infection rates tracked; mean time to eradicate (MTTE) reported.',
    5: 'Automated eradication tooling; continuous threat hunting post-eradication; ML-based confirmation of clean state.',
  },

  // ── RC.RP – Incident Recovery Plan Execution ──────────────────────────────

  'RC.RP-01': {
    1: 'No recovery plan; recovery improvised and inconsistent.',
    2: 'Recovery steps informally followed; not formally documented.',
    3: 'Formal recovery plan executed as part of IR; recovery actions documented in playbooks; recovery criteria defined; stakeholder sign-off required.',
    4: 'Recovery plan execution compliance tracked; deviation analysis performed.',
    5: 'Automated recovery playbook execution; continuous recovery plan validation through exercises.',
  },

  'RC.RP-02': {
    1: 'Recovery actions arbitrary; no prioritization of critical systems.',
    2: 'Critical systems informally prioritized for recovery; no formal framework.',
    3: 'Recovery prioritization based on BIA; recovery scope defined; actions documented with dependencies; recovery sequence mapped to business priorities.',
    4: 'Recovery prioritization accuracy measured post-incident; BIA alignment validated.',
    5: 'Dynamic recovery prioritization; automated dependency mapping; continuous BIA integration.',
  },

  'RC.RP-03': {
    1: 'Backups used without verification; corrupted or incomplete backups discovered during recovery.',
    2: 'Some backup verification done informally before use.',
    3: 'Formal backup integrity verification before recovery; hash verification; documented pre-recovery checklist; verification performed by a role separate from the recovery team.',
    4: 'Backup verification completion rates tracked; verification time measured; failed verifications analyzed.',
    5: 'Automated pre-recovery integrity verification; continuous backup health monitoring; zero-trust backup validation.',
  },

  'RC.RP-04': {
    1: 'Operations return to previous state without security improvements; same vulnerabilities remain.',
    2: 'Some security improvements made post-incident; not formally documented.',
    3: 'Formal post-incident remediation requirements; operational norms updated to address root cause; security requirements reviewed and approved by security and business leadership.',
    4: 'Post-incident improvement implementation rate tracked; operational norm changes measured.',
    5: 'Continuous post-incident improvement; automated tracking of remediation effectiveness; proactive norm evolution.',
  },

  'RC.RP-05': {
    1: 'Recovered systems returned to production without validation; re-infection or instability common.',
    2: 'Basic testing of restored systems before return to production; informal.',
    3: 'Formal restoration validation checklist; functionality testing, security configuration verification, and integrity checks required; documented sign-off before return to production.',
    4: 'Restoration validation completeness measured; post-recovery incidents from incomplete validation tracked.',
    5: 'Automated restoration validation; continuous post-recovery monitoring; adaptive validation criteria.',
  },

  'RC.RP-06': {
    1: 'Incident never formally closed; no official end declared.',
    2: 'Incident closure informal; declared when things "seem normal."',
    3: 'Formal incident closure criteria; documented sign-off from security and business; incident timeline closed in ticketing system; notifications sent; lessons learned initiated.',
    4: 'Incident closure timeliness measured; closure criteria compliance tracked.',
    5: 'Automated closure workflow; continuous improvement of closure criteria; incident closure metrics drive process improvement.',
  },

  // ── RC.CO – Incident Recovery Communication ───────────────────────────────

  'RC.CO-03': {
    1: 'No communication of recovery status to stakeholders; leadership unaware of recovery progress.',
    2: 'Informal updates to leadership on major incidents; no regular cadence.',
    3: 'Defined communication plan for recovery updates; regular status updates at defined intervals; stakeholder-specific messaging; recovery milestones communicated.',
    4: 'Communication timeliness and completeness measured; stakeholder satisfaction tracked.',
    5: 'Automated recovery status communications; real-time stakeholder dashboard; continuous communication effectiveness improvement.',
  },

  'RC.CO-04': {
    1: 'No public communication during or after incidents; customers left uninformed.',
    2: 'Public statements issued reactively when media or customers inquire.',
    3: 'Public communications process defined; legal and PR review integrated; disclosure timing meets regulatory requirements; messaging templates prepared in advance.',
    4: 'Public communication timeliness measured; regulatory disclosure SLA compliance tracked.',
    5: 'Proactive public communication program; continuous reputation monitoring; automated regulatory disclosure tracking.',
  },
};
