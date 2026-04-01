<template>
  <div class="wake_up">
    <!-- <div class="header">唤醒 app</div> -->
    <div class="section">
      <div class="section-title">Wake App</div>
      <div class="link g-flex-column-20">
        <div class="handle">
          <div class="handle-item" @click="handle('history')">History</div>
        </div>
        <div class="params">
          <input type="text" placeholder="App link / Scheme" v-model="appLink" />
        </div>
        <div class="params" v-for="(item, index) in paramsList" :index="index">
          <input @change="change" type="text" placeholder="key" v-model="item.key" />
          <input type="text" placeholder="value" v-model="item.value" />
          <button class="params-delete" @click="deleteParams(index)">-</button>
        </div>
        <div class="link-button g-flex-column-20">
          <button @click="addParams">+ Add Row</button>
        </div>
      </div>
      <div class="wake">
        <button @click="wakeApp">Open App</button>
      </div>
    </div>

    <Drawer :open="openHistoryPopup" @close="openHistoryPopup = false">
      <template v-for="(item, index) in historyList" :key="index">
        <div class="history"></div>
      </template>
    </Drawer>
  </div>
</template>

<script>
import { toRaw } from "vue";
import * as qs from "qs";
import Drawer from "@/components/Drawer/index.vue";
import { WakeUpDB } from "@/db";

const historyList = [];

export default {
  components: {
    Drawer,
  },
  data() {
    return {
      appLink: "",
      paramsList: [
        {
          key: "",
          value: "",
        },
      ],
      openHistoryPopup: false,
      // historyList: [],
    };
  },
  created() {
    // const tools_wake_up_history_store = localStorage.getItem("tools_wake_up_history");
    // if (tools_wake_up_history_store && tools_wake_up_history_store !== null) {
    //   // historyList = JSON.parse(tools_wake_up_history_store);
    //   // this.historyList = historyList;
    // }
  },
  methods: {
    handle(handel) {
      if (handel === "history") {
        this.openHistoryPopup = true;
      }
    },
    addParams() {
      this.paramsList.push({ key: "", value: "" });
    },
    deleteParams(index) {
      this.paramsList.splice(index, 1);
    },
    change() {
      console.log("start", historyList);
    },
    saveConfig() {
      console.log("start", historyList);
      const historyData = {
        paramsList: toRaw(this.paramsList),
        appLink: toRaw(this.appLink),
      };

      historyList.unshift(historyData);

      // this.historyList = historyList;
      console.log("this.historyList", historyList);
      // WakeUpDB.setItem("history", historyList)
      //   .then(function (value) {
      //     // 当离线仓库中的值被载入时，此处代码运行
      //     console.log(value);
      //   })
      //   .catch(function (err) {
      //     // 当出错时，此处代码运行
      //     console.log(err);
      //   });
    },
    wakeApp() {
      this.saveConfig();

      const obj = {};
      this.paramsList.forEach((item) => {
        Reflect.set(obj, item.key, item.value);
      });

      const wake_up_link = `${this.appLink}?${qs.stringify(obj)}`;

      // window.top.location.href = wake_up_link;
    },
  },
};
</script>

<style lang="scss" scoped>
.wake_up {
  padding: 20px 0;
  width: 100%;
  min-height: calc(100vh - 40px - 20px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.wake_up .section {
  position: relative;
  padding: 20px;
  width: 330px;
  background-color: var(--g-border-color-1);
  border-radius: var(--g-border-radius);
  border-top: 1px solid var(--g-border-color);
  border-bottom: 1px solid var(--g-border-color);
  transition: all 0.3s;
}

.wake_up .section .section-title {
  padding: 10px 15px 30px;
  width: 100%;
  text-align: center;
  color: var(--g-primary-text);
  /* border-bottom: 1px solid var(--g-border-color); */
  box-sizing: border-box;
}

.wake_up .section .link {
  padding: 10px 0;
}

.wake_up .section .link .link-button {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.handle {
  display: flex;
  justify-content: flex-end;
  color: var(--g-primary-text);
}

.handle-item {
  font-size: var(--g-font-size);
  cursor: pointer;
}

.wake_up .section .link .params {
  width: 100%;
  display: flex;
  gap: 10px;
}

.params-delete:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.wake_up .section .wake {
  padding: 50px 0 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.wake_up .section .wake button {
  width: 100%;
  height: 40px;
}
</style>
