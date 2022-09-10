const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/checkToken");
const Card = require("../models/cards");
const { generateBizNumber } = require("../models/cards");
const cardsSchema = require("../validators/cards");

    // "user_id": "630bd529439b52c7e39cae68",
    // "_id": "631a266a1e19ff9990c6763d",

router.delete("/:id", auth, async (req, res) => {
  const card = await Card.findOneAndRemove({
    id: req.params.id,
    user_id: req.uid,
  });
  if (!card) {
    return res.status(404).send("The card with the given ID was not found.");
  }
  res.send(card);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = cardsSchema.validateCard.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }
  const filter = await Card.findOneAndUpdate(
    { id: req.params.id, user_id: req.uid },
    req.body
  );
  if (!filter) {
    return res.status(400).send("The card with the given ID was not found.");
  }
  filterr = await Card.findOne({ id: req.params.id, user_id: req.uid });
  res.send(filterr);
});

router.get("/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    id: req.params.id,
    user_id: req.uid,
  });
  if (!card) {
    return res.status(404).send("The card with the given ID was not found.");
  }
  res.send(card);
});

router.post("/", auth, async (req, res) => {
  const { error } = cardsSchema.validateCard.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  let card = new Card({
    bizName: req.body.bizName,
    bizDescription: req.body.bizDescription,
    bizAddress: req.body.bizAddress,
    bizPhone: req.body.bizPhone,
    bizImage: req.body.bizImage
      ? req.body.bizImage
      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAMFBMVEXk5ueutLfHy83n6eqrsbTg4uO3vL/b3d+xt7rW2du/xMbM0NK6v8LS1deorrLr7O3KAslXAAACx0lEQVRoge2a21LEIAxAgXDv7f//VnpxXbULSTep4wznRZ88kxAKJCrV6XQ6nU6n0+l0/j2wgHIFVX7eK1ZhyDHqQox5cnCbH9zgrbX6oPw2JnWLHZTRD+8ns59ukMNgf5l3uxO3j6fmzW4WSTG43+n+wo6S6lAxy8ohVM2ichdbbm2zTMGBr2d8lw8ScsgIdZEHAXejzh5E/sChvdhH4PxfuIQMuwTOrQaPVfMHHma0W3teNWS8Ws/MpY6ttC3phjXp2A0mkHQwJLd2nO6RpLaJ0a3wO2xzcy444gT7Budp1jy4fzByummlpv0fujnPsj9109S8OSe6OWuNuMd4b4zEbwvnhZF0hDJ/U8sDkCTnPEuUo52hvJcmyoIzvw9IB7hlTXlJOuGuyP0gJFS6TdyPA3zgzJWm0E9B/hvyBjLjEi9wmFCBs7/Gdjkq6+yFdvC6v/XIuEjbYaN1lDK/hr4BsRr5LBf1Kq+lfRbuqcLwqrNofZBuqEI4Dd1qc0cbG5L/2Uq2Nst3kQ97MHo+/Nba2Q/3tO4P++Imk0fvxzwkJdq7PpHD8uC+Yck6HkrTUKIuYa+BGzOl4JTwvKb89TBkH9dFtk+FVoh+NMlJLTtAGMY4v/62rPMikxS7H5aQdcX75M+JNfuLOxlLvfbPme0LV0I+H0tVovcswa/fUOLLf9P76d2FB0eN+cn+3hWmPEcumjd7vh46BEKFnduni59bMIR30Cu5vxI6OMxIqi2P9FWHUL+aEezUSxwkHvEFOaT3l/qLmXJz5lWT5K1RMx182qndcowceXVHzXvJoHow1LkMElQ3gn2xdzBLjp73Upnbalx34QrtZohU2O3/CBAMu90Fog0AidT3mVCR79RLXWhvf1Ld44T/LLhCrCVd4Ev+THWWIbrcjRaY4A7bqOyycjO1olRmlTAZYaqFLkxF3el0Ov+fDyneIIS3gwKEAAAAAElFTkSuQmCC",
    bizNumber: await generateBizNumber(Card),
    user_id: req.uid,
  });
  post = await card.save();
  res.send(post);
});

module.exports = router;
