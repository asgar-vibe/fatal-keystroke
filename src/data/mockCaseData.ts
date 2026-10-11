import type { CaseDossier, TerminalLogEntry } from '../types';

export const MOCK_CASE_DOSSIER: CaseDossier = {
  caseId: 'CASE-0x7F // BLACK-ICE',
  targetName: 'KAIROS NEURAL LABS',
  targetEntity: 'Sub-Grid Core 09 - Zurich Relay',
  securityLevel: 'CLASS-IV MILITARY GRADE',
  iceType: 'Cerberus Adaptive Counter-ICE',
  objective: 'Bypass biometric hash gate & siphon synaptic neural schematics.',
  targetIP: '192.168.84.221:9090',
  encryptionProtocol: 'QUANTUM-SHA-512 [DYNAMIC]',
  nodeStatus: 'ONLINE',
  asciiArt: `   ╔═════════════════════════════════════╗
   ║  [TARGET: KAIROS PRIMARY FIREWALL]  ║
   ║       ┌───┐       ┌───┐             ║
   ║  NODE-01 ──► [ICE GATE] ──► DATA VAULT║
   ║       └───┘       └───┘             ║
   ║   ▲          ▲          ▲           ║
   ║   │ [PROBE]  │ [TRACE]  │ [MIL-SPEC]║
   ║  PORT:8080   GATE:SEC   HASH:DEEP   ║
   ╚═════════════════════════════════════╝`,
  evidence: [
    {
      id: 'ev-1',
      code: 'CLUE-A09',
      title: 'Sub-Relay Handshake Intercept',
      timestamp: '21:04:12',
      decrypted: true,
      content: 'Kernel bypass vulnerability identified in unpatched Zurich node routing table.',
      tags: ['EXPLOIT', 'ZERODAY']
    },
    {
      id: 'ev-2',
      code: 'CLUE-B14',
      title: 'Neural Blueprint Fragment',
      timestamp: '21:10:48',
      decrypted: true,
      content: 'Project Chimera v2 memory dump reveals encrypted quantum keys in block 0xDEADBEEF.',
      tags: ['INTEL', 'CLASSIFIED']
    },
    {
      id: 'ev-3',
      code: 'CLUE-C32',
      title: 'Director Access Token',
      timestamp: '21:14:02',
      decrypted: false,
      content: 'ENCRYPTED CIPHER: [Awaiting keystroke sequence injection to decipher payload]',
      tags: ['KEY', 'LOCKED']
    }
  ]
};

export const INITIAL_TERMINAL_LOGS: TerminalLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '21:12:01',
    type: 'sys',
    text: 'FATAL KEYSTROKE v1.4.2 [CYBER-INTEL OS]'
  },
  {
    id: 'log-2',
    timestamp: '21:12:02',
    type: 'sys',
    text: 'Establishing secure tunnel through Proxy Node 14.201.78.33...'
  },
  {
    id: 'log-3',
    timestamp: '21:12:04',
    type: 'success',
    text: '[OK] Cryptographic handshakes established. Tunnel cipher: AES-256-GCM.'
  },
  {
    id: 'log-4',
    timestamp: '21:12:05',
    type: 'warn',
    text: '[WARNING] Sentinel trace routines active on target subnet. Typing latency will trigger intrusion detection.'
  },
  {
    id: 'log-5',
    timestamp: '21:13:10',
    type: 'cmd',
    promptPrefix: 'root@intel-node-7:/#',
    text: 'nmap -sS -p 9090 kairos-zurich.net'
  },
  {
    id: 'log-6',
    timestamp: '21:13:12',
    type: 'output',
    text: 'PORT 9090/TCP OPEN // Service: CERBERUS-FIREWALL-DAEMON v2.8'
  },
  {
    id: 'log-7',
    timestamp: '21:14:30',
    type: 'cmd',
    promptPrefix: 'root@intel-node-7:/#',
    text: 'inject --payload ./exploits/synapse_overflow.bin'
  },
  {
    id: 'log-8',
    timestamp: '21:14:32',
    type: 'trace',
    text: '[TRACE DETECTED] Target intrusion alert level increased by +12%!'
  }
];

export const SAMPLE_TARGET_COMMANDS = [
  'nmap -sV -T4 10.0.4.15',
  'cat /etc/shadow | grep admin',
  'hydra -l root -P dict.txt ssh://target',
  'sudo bypass-ice --override --target 192.168.84.221',
  'ssh -i /root/.ssh/id_rsa cipher@192.168.1.100 -p 2222',
  'airmon-ng start wlan0 && airodump-ng wlan0mon',
  'decrypt-vault --token 0xDEADBEEF --depth 4',
  'curl -X POST https://api.kairos.net/v1/synapse -d "token=0xDE4D"',
  'killall -9 sentinel_tracer_daemon',
  'siphon --data /sys/neural_synapse.bin --speed max',
  'shred -u -z -n 35 /var/log/surveillance_feed.log',
  'quantum-hash-crack --rounds 2048 --salt KAIROS_CORE'
];
