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
      <el-table-column label="Last Edited">
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
      <el-table-column label="Edit" width="80">
        <template slot-scope="scope"
          ><el-button size="mini" @click="onEdit(scope.row)"
            ><i class="el-icon-edit"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
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
import store from '@/store';

import { GET_ARTICLES, SET_PAGE, GET_ARTICLE } from '@/store/modules/article';
import { LOAD_POST } from '@/store/modules/post';

export default {
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
    }),
    ...mapActions('post', {
      loadPost: LOAD_POST,
    }),
    onSelectionChange(ev) {
      console.log('selection changed', ev);
    },
    onSizeChange(ev) {
      console.log('onSizeChange', ev);
    },
    onPageChange(page) {
      // console.log('onPageChange', ev);
      this.$router.push({ query: { page } });
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
