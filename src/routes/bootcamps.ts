import { Request, Response, Router } from "express";
const router: Router = Router();

router.get("/", function (req: Request, res: Response) {
  /* 
  - sending data from server
  res.send({ name: "Pariston" });

  - sending json data
  res.json({ name: "Pariston" });

  - sending status (only)
  res.sendStatus(300); // just sends a status

  - status with data
  res.status(200).json({ success: true });
  */
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

router.get("/:id", function (req: Request, res: Response) {
  res
    .status(200)
    .json({ success: true, msg: `Get a single bootcamp ${req.params.id}` });
});

router.post("/", function (req: Request, res: Response) {
  res.status(201).json({ success: true, msg: "Create a new bootacamp" });
});

router.put("/:id", function (req: Request, res: Response) {
  res
    .status(200)
    .json({ success: true, msg: `Update a bootcamp ${req.params.id}` });
});

router.delete("/:id", function (req: Request, res: Response) {
  res
    .status(200)
    .json({ success: true, msg: `Delete a bootcamp ${req.params.id}` });
});

module.exports = router;
