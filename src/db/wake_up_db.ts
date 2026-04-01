import localforage from 'localforage';

localforage.config({
  name: 'tools',
  storeName: 'wake_up'
});

const store = localforage.createInstance({
  name: "tools"
});

export default store;
