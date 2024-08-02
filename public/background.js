let timer;
let time = 1500;
let isActive = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['time', 'isActive'], (result) => {
    if (result.time !== undefined && result.isActive !== undefined) {
      time = result.time;
      isActive = result.isActive;
    }
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['time', 'isActive'], (result) => {
    if (result.time !== undefined && result.isActive !== undefined) {
      time = result.time;
      isActive = result.isActive;
      if (isActive) {
        startTimer();
      }
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    isActive = true;
    time = request.time || 1500;
    chrome.storage.sync.set({ time, isActive });
    startTimer();
  } else if (request.action === 'reset') {
    isActive = false;
    resetTimer();
  } else if (request.action === 'get_state') {
    sendResponse({ time, isActive });
  }
});

function startTimer() {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    if (isActive && time > 0) {
      time -= 1;
      chrome.storage.sync.set({ time, isActive });
    } else if (time === 0) {
      isActive = false;
      clearInterval(timer);
      chrome.storage.sync.set({ isActive: false });
      chrome.storage.sync.set({ time: 0 }); 
      notifyTimeUp();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  time = 1500;
  isActive = false;
  chrome.storage.sync.set({ time, isActive });
}

function notifyTimeUp() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Pomodoro Timer',
    message: "Time's up!",
    priority: 2
  });
}
