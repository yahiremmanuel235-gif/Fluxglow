import sys

def modify_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Define a helper inside the component for local date string
    old_handle = """  const handleAcceptMission = (id: string) => {
    setSchedulingMissionId(id);
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    setScheduleDateInput(d.toISOString().split('T')[0]);
    setScheduleTimeInput(d.toTimeString().substring(0, 5));
  };"""

    new_handle = """  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleAcceptMission = (id: string) => {
    setSchedulingMissionId(id);
    const d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    setScheduleDateInput(formatLocalDate(d));
    setScheduleTimeInput(d.toTimeString().substring(0, 5));
  };"""
    content = content.replace(old_handle, new_handle)

    old_min = """min={new Date().toISOString().split('T')[0]}"""
    new_min = """min={formatLocalDate(new Date())}"""
    content = content.replace(old_min, new_min)

    with open(filename, 'w') as f:
        f.write(content)

modify_file('src/components/modules/MissionsModule.tsx')
