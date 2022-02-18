module.exports = class UserDtoPicture {
  email;
  id;
  isActivated;
  picture;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.picture = model.picture
  }
}
