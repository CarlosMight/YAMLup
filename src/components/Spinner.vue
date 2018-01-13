<template lang="pug">
  .container.text-center
    p
      i.icon-spinner5
    p {{label}}
</template>



<script>
  /**
   * Shows a simple spinner with a label underneath
   */
  export default {
    props: {
      label: {
        type: String,
        default: 'loading'
      }
    }
  }
</script>


<style lang="sass">
</style>
