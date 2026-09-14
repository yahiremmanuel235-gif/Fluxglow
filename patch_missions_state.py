import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    new_imports = """import { useToast } from '../common/Toast';
import { decrementFluxStreak } from '../../utils/streakManager';"""
    content = content.replace("import { useToast } from '../common/Toast';", new_imports)

    state_code = """
  const [schedules, setSchedules] = useState<Record<string, string>>({});
  const [rejected, setRejected] = useState<string[]>([]);
  const [schedulingMissionId, setSchedulingMissionId] = useState<string | null>(null);
  const [scheduleTimeInput, setScheduleTimeInput] = useState<string>('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    try {
      const s = localStorage.getItem('fluxglow_mission_schedules');
      if (s) setSchedules(JSON.parse(s));
      const r = localStorage.getItem('fluxglow_mission_rejected');
      if (r) setRejected(JSON.parse(r));
    } catch (e) {}
    
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const saveSchedules = (newSchedules: Record<string, string>) => {
    setSchedules(newSchedules);
    localStorage.setItem('fluxglow_mission_schedules', JSON.stringify(newSchedules));
  };
  const saveRejected = (newRejected: string[]) => {
    setRejected(newRejected);
    localStorage.setItem('fluxglow_mission_rejected', JSON.stringify(newRejected));
  };

  const handleAcceptMission = (id: string) => {
    setSchedulingMissionId(id);
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    setScheduleTimeInput(d.toTimeString().substring(0, 5));
  };

  const confirmSchedule = (id: string) => {
    if (!scheduleTimeInput) return;
    const [hours, minutes] = scheduleTimeInput.split(':').map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() < Date.now()) {
      d.setDate(d.getDate() + 1); // schedule for tomorrow if time passed
    }
    const updated = { ...schedules, [id]: d.toISOString() };
    saveSchedules(updated);
    setSchedulingMissionId(null);
    success('Misión programada correctamente.');
  };

  const handleRejectMission = (id: string) => {
    const updated = [...rejected, id];
    saveRejected(updated);
    info('Has rechazado la misión.');
  };

  // Check for expirations
  useEffect(() => {
    let changed = false;
    const newRejected = [...rejected];
    Object.entries(schedules).forEach(([id, timeStr]) => {
      if (rejected.includes(id)) return;
      const scheduledTime = new Date(timeStr).getTime();
      const current = now.getTime();
      if (current > scheduledTime + 60 * 60 * 1000) { // 1 hour passed
        // Failed!
        newRejected.push(id);
        changed = true;
        warning('Has fallado una misión programada. Se restó XP.');
        decrementFluxStreak(30);
      }
    });
    if (changed) {
      saveRejected(newRejected);
    }
  }, [now, schedules, rejected]);
"""
    content = content.replace("const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');", state_code + "\n  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('all');")

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/MissionsModule.tsx')
