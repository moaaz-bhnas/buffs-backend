import { Request, Response } from "express";
import Bootcamp from "../models/Bootcamp";

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export async function getBootcamps(req: Request, res: Response) {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

// @desc      Get a single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export async function getBootcamp(req: Request, res: Response) {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (bootcamp) {
      res.status(200).json({ success: true, data: bootcamp });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

// @desc      Create a bootcamp
// @route     POST /api/v1/bootcamps
// @access    Public
export async function createBootcamp(req: Request, res: Response) {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public
export async function updateBootcamp(req: Request, res: Response) {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Public
export async function deleteBootcamp(req: Request, res: Response) {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
