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
            <mavon-editor
              v-model="userContent"
              language="en"
              ref="mdEditor"
              @imgAdd="onImageAdd"
              @imgDel="onImageDel"
            />
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
            :http-request="onCoverImageRequest"
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

        <validation-provider
          v-slot="{ errors }"
          name="tags"
          rules="required"
          ref="tagsValidation"
        >
          <el-form-item label="tag" :error="errors[0]">
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
        </validation-provider>

        <el-form-item label="Last Edited">
          <span>{{ post.updatedAt | fullDate }}</span>
        </el-form-item>
        <el-form-item label="Created">
          <span>{{ post.createdAt | fullDate }}</span>
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
import { GET_TAGS } from '@/store/modules/article';
import {
  INIT,
  LOAD_POST,
  MODIFY_POST,
  SET_USER_TITLE,
  SET_USER_CONTENT,
  SET_USER_DESC,
  SET_USER_LINK,
  SET_USER_COVER_IMAGE,
  SET_USER_TAGS,
} from '@/store/modules/post';
import { Message, Loading } from 'element-ui';
import { uploadFile, getFileUrl } from '@/api/upload';
import asyncHandler from '@/utils/asyncHandler';

export default {
  data: () => ({ tagInput: '', tagInputVisible: false }),
  computed: {
    ...mapState('post', ['post']),
    ...mapState('post', {
      _userTitle: 'userTitle',
      _userContent: 'userContent',
      _userDesc: 'userDesc',
      _userLink: 'userLink',
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
    userCoverImage: {
      get() {
        return this._userCoverImage;
      },
      set(v) {
        this.setUserCoverImage(v);
      },
    },
    userTags: {
      get() {
        return this._userTags;
      },
      set(v) {
        this.setUserTags(v);
        this.$refs.tagsValidation.validate(v);
      },
    },
    userCoverImageUrl() {
      return getFileUrl(this.userCoverImage);
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
      loadPost: LOAD_POST,
    }),
    ...mapActions('post', { modifyPost: MODIFY_POST }),
    ...mapActions('article', { getTags: GET_TAGS }),
    async tagSearch(keyword, cb) {
      const tags = await this.getTags(keyword);
      console.log('tag', tags);
      cb(tags.map((t) => ({ value: t.tag, count: t.articleCount })));
    },
    async onSubmit() {
      this.$loading = Loading.service({ fullscreen: true });
      await this.modifyPost();
      Message({ message: 'Post is updated!', type: 'success', duration: 5000 });
      this.$loading.close();
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
    async onCoverImageRequest(ev) {
      const req = await asyncHandler(uploadFile, ev.file);
      if (req.error) {
        this.$refs.uploadFile.abort();
        return null;
      }
      const [imageUrl] = req.result.urls;
      this.userCoverImage = imageUrl;
      return req;
    },
    async onImageAdd(pos, $file) {
      const req = await asyncHandler(uploadFile, $file);
      if (req.error) {
        // handle error
        return null;
      }
      const [imageUrl] = req.result.urls;
      this.$refs.mdEditor.$img2Url(pos, getFileUrl(imageUrl));
      return req;
    },
    async onImageDel() {
      // handle deletion
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
