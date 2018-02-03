module.exports = function() {
  return {
    templatesMap: {},
    contentTree: undefined,
    contentMap: {},
    contentList: [],
    model: undefined,

    //methods
    reset: function() {
      this.templatesMap = {};
      this.contentTree = undefined;
      this.contentMap = {};
      this.contentList = [];
      this.model = undefined;
    }
  };
};
