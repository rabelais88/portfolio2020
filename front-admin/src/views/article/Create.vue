<template>
  <el-form>
    <el-form-item label="title">
      <ValidationProvider v-slot="{ errors }">
        <el-input v-model="userTitle" type="text"></el-input>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SET_USER_TITLE } from '@/store/modules/article';

export default {
  computed: {
    ...mapState('article', { _userTitle: 'userTitle' }),
    userTitle: {
      get() {
        return this._userTitle;
      },
      set(v) {
        this.setUserTitle(v);
      },
    },
  },
  methods: {
    ...mapMutations('article', { setUserTitle: SET_USER_TITLE }),
  },
};
</script>
