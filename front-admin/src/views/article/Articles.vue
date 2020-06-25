<template>
  <form-margin>
    <el-table
      :data="articles"
      @selection-change="handleSelectionChange"
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
      <el-table-column label="Edit" width="80">
        <template slot-scope="scope"
          ><el-button size="mini" @click="onEdit(scope.row)">edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </form-margin>
</template>

<script>
import { GET_ARTICLES, SET_PAGE, GET_ARTICLE } from '@/store/modules/article';
import { LOAD_POST } from '@/store/modules/post';
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('article', ['articles']),
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
    ...mapActions('article', {
      getArticles: GET_ARTICLES,
      setPage: SET_PAGE,
      getArticle: GET_ARTICLE,
    }),
    ...mapActions('post', {
      loadPost: LOAD_POST,
    }),
    handleSelectionChange(ev) {
      console.log('selection changed', ev);
    },
    onEdit(article) {
      if (article.type === 'POST') {
        this.$router.push({
          name: 'EditPost',
          query: { articleId: article.articleId },
        });
        return null;
      }
      return null;
    },
  },
  beforeMount() {
    this.getArticles();
  },
};
</script>
