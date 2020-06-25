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

        <el-form-item label="Last Edited">
          <span>{{ post.updatedAt }}</span>
        </el-form-item>
        <el-form-item label="Created">
          <span>{{ post.createdAt }}</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSubmit(onSubmit)">submit</el-button>
        </el-form-item>
      </validation-observer>
    </el-form>
  </form-margin>
</template>

<script>
import store from '@/store';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  INIT,
  ADD_POST,
  LOAD_POST,
  MODIFY_POST,
  SET_USER_TITLE,
  SET_USER_CONTENT,
  SET_USER_DESC,
  SET_USER_LINK,
} from '@/store/modules/post';
import { Message, Loading } from 'element-ui';

export default {
  computed: {
    ...mapState('post', ['post']),
    ...mapState('post', {
      _userTitle: 'userTitle',
      _userContent: 'userContent',
      _userDesc: 'userDesc',
      _userLink: 'userLink',
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
    userDesc: {
      get() {
        return this._userDesc;
      },
      set(v) {
        this.setUserDesc(v);
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
  },
  methods: {
    ...mapMutations('post', {
      setUserContent: SET_USER_CONTENT,
      setUserTitle: SET_USER_TITLE,
      setUserDesc: SET_USER_DESC,
      setUserLink: SET_USER_LINK,
      init: INIT,
      loadPost: LOAD_POST,
    }),
    ...mapActions('post', { addPost: ADD_POST, modifyPost: MODIFY_POST }),
    async onSubmit() {
      this.$loading = Loading.service({ fullscreen: true });
      await this.modifyPost();
      Message({ message: 'Post is updated!', type: 'success', duration: 5000 });
      this.$loading.close();
      return null;
    },
  },
  async beforeRouteEnter(to, from, next) {
    console.log('loading article', { to, from, next });
    await store.dispatch(`post/${LOAD_POST}`, to.params.articleId, {
      root: true,
    });
    next();
  },
  beforeDestroy() {
    this.init();
  },
};
</script>
