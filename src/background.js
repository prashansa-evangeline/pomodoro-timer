let timerInterval = null;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ time: 1500, isActive: false });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.sync.get(["time", "isActive"], (result) => {
      if (result.isActive && result.time > 0) {
        const newTime = result.time - 1;
        chrome.storage.sync.set({ time: newTime });
        if (newTime === 0) {
          chrome.storage.sync.set({ isActive: false });
          chrome.alarms.clear("pomodoroTimer");
        }
      }
    });
  }
});

function startTimer() {
  chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 });
}

function stopTimer() {
  chrome.alarms.clear("pomodoroTimer");
}

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isActive) {
    if (changes.isActive.newValue) {
      startTimer();
    } else {
      stopTimer();
    }
  }
});
