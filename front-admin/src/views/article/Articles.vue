<template>
  <form-margin> </form-margin>
</template>

<script>
import { GET_ARTICLES } from '@/store/modules/article';
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('article', { getArticles: GET_ARTICLES }),
  },
  beforeMount() {
    this.getArticles();
  },
};
</script>
