<template lang="pug">
  .content-padding.content-width(v-html='html')
</template>

<script>
  export default {
    name: 'project-single',
    props: ['html']
  }
</script>

<style lang="sass">
</style>
