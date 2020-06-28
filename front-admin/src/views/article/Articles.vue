<template>
  <form-margin>
    <el-table
      :data="articles"
      @selection-change="onSelectionChange"
      style="width: 100%;"
      size="mini"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="Title">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="Last Edited" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row._updatedAt > scope.row._createdAt">{{
            scope.row._updatedAt
          }}</span>
          <span v-else>{{ scope.row._createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Tag" width="130">
        <template slot-scope="scope">
          <el-tag size="mini" v-for="tag in scope.row._tags" :key="tag">{{
            tag
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="70">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column label="Edit" width="150">
        <template slot-scope="scope"
          ><el-button size="mini" @click="onEdit(scope.row)"
            ><i class="el-icon-edit"></i
          ></el-button>
          <!-- <el-button size="mini" @click="onRemove(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-button
      size="mini"
      @click="onRemove"
      :disabled="selectedArticlesId.length === 0"
    >
      <i class="el-icon-delete"></i>delete selected
    </el-button>
    <el-pagination
      small
      layout="prev, pager, next"
      :total="count"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="onPageChange"
      @size-change="onSizeChange"
    />
  </form-margin>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { Message } from 'element-ui';
import store from '@/store';

import {
  GET_ARTICLES,
  SET_PAGE,
  GET_ARTICLE,
  // REMOVE_ARTICLE,
  REMOVE_ARTICLES,
} from '@/store/modules/article';
import { LOAD_POST } from '@/store/modules/post';

export default {
  data: () => ({
    selectedArticlesId: [],
  }),
  computed: {
    ...mapState('article', ['articles', 'count', 'pageSize', 'page']),
    ...mapState('article', { _page: 'page' }),
    page: {
      get() {
        return this._page;
      },
      set(v) {
        this.setPage(v);
      },
    },
  },
  methods: {
    ...mapMutations('article', {
      setPage: SET_PAGE,
    }),
    ...mapActions('article', {
      getArticles: GET_ARTICLES,
      getArticle: GET_ARTICLE,
      // removeArticle: REMOVE_ARTICLE,
      removeArticles: REMOVE_ARTICLES,
    }),
    ...mapActions('post', {
      loadPost: LOAD_POST,
    }),
    onSelectionChange(rows) {
      this.selectedArticlesId = rows.map((r) => r.id);
    },
    onSizeChange(ev) {
      console.log('onSizeChange', ev);
    },
    onPageChange(page) {
      // console.log('onPageChange', ev);
      this.$router.push({ query: { page } });
    },
    async onRemove() {
      const reqs = await this.removeArticles(this.selectedArticlesId);
      if (reqs.find((r) => r.error)) {
        Message({ message: 'error while deleting the article', type: 'error' });
        return null;
      }
      Message({ message: 'the article is deleted', type: 'success' });
      return null;
    },
    onEdit(article) {
      console.log('onEdit', { article });
      if (article.type === 'POST') {
        this.$router.push({
          name: 'EditPost',
          params: { articleId: article.id },
        });
        return null;
      }
      return null;
    },
  },
  async beforeRouteUpdate(to, from, next) {
    const page = Math.round((to.query || {}).page || 1);
    if (page >= 1) {
      await store.commit(`article/${SET_PAGE}`, page, {
        root: true,
      });
      await store.dispatch(`article/${GET_ARTICLES}`, null, { root: true });
    }
    next();
  },
  async beforeRouteEnter(to, from, next) {
    console.log({ to, from, next });
    const page = Math.round((to.query || {}).page || 1);
    await store.commit(`article/${SET_PAGE}`, page, {
      root: true,
    });
    await store.dispatch(`article/${GET_ARTICLES}`, null, { root: true });
    next();
  },
  // beforeMount() {
  //   this.getArticles();
  // },
};
</script>
