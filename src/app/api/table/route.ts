import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const findTable = await prisma.table.findMany();
    return NextResponse.json({
      message: "Record updated successfully",
      data: findTable,
    });
  } catch (error) {
    console.error("Error in authorize function:", error);
  }
}
