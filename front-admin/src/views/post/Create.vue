<template>
  <form-margin>
    <el-form size="mini" label-width="120px" @submit.native.prevent>
      <validation-observer v-slot="{ handleSubmit }">
        <validation-provider
          name="title"
          v-slot="{ errors }"
          rules="required|min:3"
        >
          <el-form-item label="Title" :error="errors[0]">
            <el-input v-model="userTitle" type="text" />
          </el-form-item>
        </validation-provider>
        <el-form-item>
          <el-button @click="handleSubmit(onSubmit)">submit</el-button>
        </el-form-item>
      </validation-observer>
    </el-form>
  </form-margin>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { SET_USER_TITLE, INIT, ADD_POST } from '@/store/modules/post';

export default {
  computed: {
    ...mapState('post', { _userTitle: 'userTitle' }),
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
    ...mapMutations('post', { setUserTitle: SET_USER_TITLE, init: INIT }),
    ...mapActions('post', { addPost: ADD_POST }),
    async onSubmit() {
      await this.addPost();
    },
  },
  beforeMount() {
    this.init();
  },
  beforeDestroy() {
    this.init();
  },
};
</script>
