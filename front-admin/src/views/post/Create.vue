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

        <el-form-item label="Cover Image">
          <el-upload
            action="#"
            list-type="picture-card"
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeCoverUpload"
            :http-request="onHttpRequest"
            :file-list="fileList"
            :limit="1"
            ref="coverUploader"
            v-if="userCoverImage === ''"
          />
          <img
            class="el-upload el-upload--picture-card"
            v-if="userCoverImage !== ''"
            :src="userCoverImageUrl"
            @click="onRemoveCoverImage"
          />
        </el-form-item>

        <el-form-item label="tag">
          <el-tag
            v-for="tag in userTags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="onRemoveTag(tag)"
            >{{ tag }}</el-tag
          >
          <el-autocomplete
            class="input-new-tag"
            v-if="tagInputVisible"
            v-model="tagInput"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="onInputConfirm"
            @select="onTagSelect"
            :fetch-suggestions="tagSearch"
          >
          </el-autocomplete>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="() => (tagInputVisible = true)"
            >+ New Tag</el-button
          >
        </el-form-item>

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
import { uploadFile, getFileUrl } from '@/api/upload';
import { GET_TAGS } from '@/store/modules/article';
import {
  INIT,
  ADD_POST,
  SET_USER_TITLE,
  SET_USER_CONTENT,
  SET_USER_DESC,
  SET_USER_LINK,
  SET_USER_COVER_IMAGE,
  SET_USER_TAGS,
} from '@/store/modules/post';
import asyncHandler from '@/utils/asyncHandler';

export default {
  data: () => ({ tagInput: '', tagInputVisible: false }),
  computed: {
    ...mapState('post', {
      _userTitle: 'userTitle',
      _userContent: 'userContent',
      _userLink: 'userLink',
      _userDesc: 'userDesc',
      _userCoverImage: 'userCoverImage',
      _userTags: 'userTags',
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
    userCoverImage: {
      get() {
        return this._userCoverImage;
      },
      set(v) {
        this.setUserCoverImage(v);
      },
    },
    userCoverImageUrl() {
      return getFileUrl(this.userCoverImage);
    },
    userDesc: {
      get() {
        return this._userDesc;
      },
      set(v) {
        this.setUserDesc(v);
      },
    },
    userTags: {
      get() {
        return this._userTags;
      },
      set(v) {
        this.setUserTags(v);
      },
    },
    fileList() {
      if (this.userCoverImage === '') return [];
      return [{ name: 'coverImage.jpg', url: getFileUrl(this.userCoverImage) }];
    },
  },
  methods: {
    ...mapMutations('post', {
      setUserContent: SET_USER_CONTENT,
      setUserTitle: SET_USER_TITLE,
      setUserDesc: SET_USER_DESC,
      setUserLink: SET_USER_LINK,
      setUserCoverImage: SET_USER_COVER_IMAGE,
      setUserTags: SET_USER_TAGS,
      init: INIT,
    }),
    ...mapActions('post', { addPost: ADD_POST }),
    ...mapActions('article', { getTags: GET_TAGS }),
    async tagSearch(keyword, cb) {
      const tags = await this.getTags(keyword);
      console.log('tag', tags);
      cb(tags.map((t) => ({ value: t.tag, count: t.articleCount })));
    },
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
    onRemoveTag(tag) {
      this.userTags = this.userTags.filter((t) => t !== tag);
    },
    onTagSelect({ value, count }) {
      this.userTags = [...this.userTags, value];
      this.tagInput = '';
      this.tagInputVisible = false;
    },
    onInputConfirm() {
      // replace this with autocomplete later
      if (this.tagInput !== '') {
        this.userTags = [...this.userTags, this.tagInput];
      }
      this.tagInputVisible = false;
      this.tagInput = '';
    },
    beforeCoverUpload(file) {}, // return bool for validation
    onRemoveCoverImage() {
      this.userCoverImage = '';
    },
    async onHttpRequest(ev) {
      const req = await asyncHandler(uploadFile, ev.file);
      if (req.error) {
        this.$refs.uploadFile.abort();
        return null;
      }
      const [imageUrl] = req.result.urls;
      this.userCoverImage = imageUrl;
      return req;
    },
  },
  beforeMount() {
    this.init();
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
