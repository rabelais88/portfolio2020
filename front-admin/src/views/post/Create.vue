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

        <el-form-item label="Description">
          <el-input v-model="userDesc" type="text" />
        </el-form-item>

        <validation-provider
          v-slot="{ errors }"
          name="content"
          rules="required|min:1"
        >
          <el-form-item label="Content" :error="errors[0]">
            <mavon-editor v-model="userContent" language="en" />
          </el-form-item>
        </validation-provider>

        <validation-provider v-slot="{ errors }" name="link" rules="url">
          <el-form-item label="Link" :error="errors[0]">
            <el-input v-model="userLink" type="text" />
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
import { Loading, Message } from 'element-ui';
import {
  INIT,
  ADD_POST,
  MODIFY_POST,
  SET_USER_TITLE,
  SET_USER_CONTENT,
  SET_USER_DESC,
  SET_USER_LINK,
} from '@/store/modules/post';

export default {
  computed: {
    ...mapState('post', {
      _userTitle: 'userTitle',
      _userContent: 'userContent',
      _userLink: 'userLink',
      _userDesc: 'userDesc',
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
    userLink: {
      get() {
        return this._userLink;
      },
      set(v) {
        this.setUserLink(v);
      },
    },
    userDesc: {
      get() {
        return this._userDesc;
      },
      set(v) {
        this.setUserDesc(v);
      },
    },
  },
  methods: {
    ...mapMutations('post', {
      setUserContent: SET_USER_CONTENT,
      setUserTitle: SET_USER_TITLE,
      setUserDesc: SET_USER_DESC,
      setUserLink: SET_USER_LINK,
      init: INIT,
    }),
    ...mapActions('post', { addPost: ADD_POST, modifyPost: MODIFY_POST }),
    async onSubmit() {
      this.$loading = Loading.service({ fullscreen: true });
      const req = await this.addPost();
      this.$loading.close();
      if (req.error) {
        Message({
          message: 'failed to create!',
          type: 'error',
          duration: 3000,
        });
        return null;
      }
      Message({ message: 'Post is created!', type: 'success', duration: 3000 });
      this.$router.replace({
        name: 'EditPost',
        params: { articleId: req.result.articleId },
      });
      return null;
    },
  },
  beforeMount() {
    this.init();
  },
};
</script>
