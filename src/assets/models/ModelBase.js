module.exports = class ModelBase {
  type
  id

  /**
   *
   * @param type
   * @param {string} id
   */
  constructor (type, id) {
    this.type = type
    this.id = id
  }
}
