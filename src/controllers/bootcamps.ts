import { Request, Response } from "express";

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export function getBootcamps(req: Request, res: Response) {
  res.status(200).json({ success: true, msg: "Get all bootacamps" });
}

// @desc      Get a single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export function getBootcamp(req: Request, res: Response) {
  res.status(200).json({
    success: true,
    msg: `Get a single bootacamp with id: ${req.params.id}`,
  });
}

// @desc      Create a bootcamp
// @route     POST /api/v1/bootcamps
// @access    Public
export function createBootcamp(req: Request, res: Response) {
  res.status(201).json({ success: true, msg: "Create a new bootacamp" });
}

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public
export function updateBootcamp(req: Request, res: Response) {
  res.status(200).json({
    success: true,
    msg: `Update a bootacamp with id: ${req.params.id}`,
  });
}

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Public
export function deleteBootcamp(req: Request, res: Response) {
  res.status(200).json({
    success: true,
    msg: `Delete a bootacamp with id: ${req.params.id}`,
  });
}
