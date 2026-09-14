import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    old_effect = """  // Check for expirations
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
  }, [now, schedules, rejected]);"""

    new_effect = """  const [notified, setNotified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const n = localStorage.getItem('fluxglow_mission_notified');
      if (n) setNotified(JSON.parse(n));
    } catch (e) {}
  }, []);

  const saveNotified = (newNotified: Record<string, boolean>) => {
    setNotified(newNotified);
    localStorage.setItem('fluxglow_mission_notified', JSON.stringify(newNotified));
  };

  // Check for expirations and notifications
  useEffect(() => {
    let rejectedChanged = false;
    let notifiedChanged = false;
    const newRejected = [...rejected];
    const newNotified = { ...notified };

    Object.entries(schedules).forEach(([id, timeStr]) => {
      if (rejected.includes(id)) return;
      
      const targetMission = missions.find(m => m.id === id);
      if (targetMission?.status === 'completed') return;

      const scheduledTime = new Date(timeStr).getTime();
      const current = now.getTime();
      
      // Notify when it's time
      if (current >= scheduledTime && !newNotified[id]) {
        newNotified[id] = true;
        notifiedChanged = true;
        info(`¡Es hora de iniciar tu misión programada!`);
      }

      // Fail if 1 hour passed
      if (current > scheduledTime + 60 * 60 * 1000) {
        newRejected.push(id);
        rejectedChanged = true;
        warning('Has fallado una misión programada (pasó 1 hora). Se restó XP.');
        decrementFluxStreak(30);
      }
    });

    if (rejectedChanged) {
      saveRejected(newRejected);
    }
    if (notifiedChanged) {
      saveNotified(newNotified);
    }
  }, [now, schedules, rejected, notified, missions]);"""
    
    content = content.replace(old_effect, new_effect)
    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/MissionsModule.tsx')
