<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div v-if="loadState === SUCCESS">{{ JSON.stringify(tags) }}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { LOAD_DASHBOARD } from '@/store/modules/dashboard';
import { LOADING, SUCCESS, FAIL } from '@/constants/loadState';

export default {
  name: 'Dashboard',
  computed: {
    LOADING: () => LOADING,
    SUCCESS: () => SUCCESS,
    FAIL: () => FAIL,
    ...mapGetters(['name']),
    ...mapState('dashboard', ['loadState', 'tags', 'dashboard']),
  },
  methods: {
    ...mapActions('dashboard', { loadDashboard: LOAD_DASHBOARD }),
  },
  beforeMount() {
    this.loadDashboard();
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
