describe("snake.js", function() {
  describe("food class", function() {
    it("should have a specific strawberry png as its view", function() {
      var food = new Food();
      expect(food.view).toEqual(
        '<img src="http://icons.iconarchive.com/icons/fi3ur/fruitsalad/16/strawberry-icon.png" />'
      );
    });
  });
});