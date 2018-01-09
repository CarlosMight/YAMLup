<template lang="pug">
  .content-padding.content-width(v-html='html')
    h1 test
</template>

<script>
  export default {
    name: 'layout-my-projects',
    props: ['html']
  }
</script>

<style lang="sass">
</style>
