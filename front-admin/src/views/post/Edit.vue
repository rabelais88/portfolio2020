<template>
  <form-margin>
    <el-form size="mini" label-width="120px" @submit.native.prevent>
      <validation-observer v-slot="{ handleSubmit }">
        <validation-provider
          v-slot="{ errors }"
          name="title"
          rules="required|min:3"
        >
          <el-form-item label="Title" :error="errors[0]">
            <el-input v-model="userTitle" type="text" />
          </el-form-item>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="content"
          rules="required|min:1"
        >
          <el-form-item label="Content" :error="errors[0]">
            <mavon-editor v-model="userContent" language="en" />
          </el-form-item>
        </validation-provider>
        <!-- <mavon-editor v-model="userContent" /> -->
        <el-form-item>
          <el-button @click="handleSubmit(onSubmit)">submit</el-button>
        </el-form-item>
      </validation-observer>
    </el-form>
  </form-margin>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  SET_USER_TITLE,
  INIT,
  ADD_POST,
  LOAD_POST,
  MODIFY_POST,
  SET_USER_CONTENT,
} from '@/store/modules/post';

export default {
  computed: {
    ...mapState('post', {
      _userTitle: 'userTitle',
      _userContent: 'userContent',
      postId: 'id',
    }),
    userTitle: {
      get() {
        return this._userTitle;
      },
      set(v) {
        this.setUserTitle(v);
      },
    },
    userContent: {
      get() {
        return this._userContent;
      },
      set(v) {
        this.setUserContent(v);
      },
    },
  },
  methods: {
    ...mapMutations('post', {
      setUserContent: SET_USER_CONTENT,
      setUserTitle: SET_USER_TITLE,
      init: INIT,
      loadPost: LOAD_POST,
    }),
    ...mapActions('post', { addPost: ADD_POST, modifyPost: MODIFY_POST }),
    async onSubmit() {
      await this.modifyPost();
      return null;
    },
  },
  // beforeMount() {
  //   this.loadPost(this.$route.query.articleId);
  // },
  beforeDestroy() {
    this.init();
  },
};
</script>
