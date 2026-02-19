//create project

import { prisma } from "../configs/prisma";

export const createProject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const {
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    //does the use have admin role for workspace?
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: { include: { user: true } },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    if (
      !workspace.members.some(
        (member) => member.userId === userId && member.role === "ADMIN",
      )
    ) {
      return res
        .status(403)
        .json({
          message:
            "You don't have permisson to create projects in this workspace",
        });
    }

    //Get team lead using email

    const teamLead = await prisma.user.findUnique({
      where: { email: team_lead },
      select: { id: true },
    });

    const project = await prisma.project.create({
      data: {
        workspaceId,
        name,
        description,
        status,
        priority,
        progress,
        team_lead: teamLead?.id,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });
    ///add members to the project if in the workspace

    if (team_members?.length > 0) {
      const membersToAdd = [];

      workspace.members.forEach((member) => {
        if (team_members.includes(member.user.email)) {
          membersToAdd.push(member.user.id);
        }
      });

      await prisma.projectMember.createMany({
        data: membersToAdd.map((memberId) => ({
          projectId: project.id,
          userId: memberId,
        })),
      });
    }

    const projectWithMembers = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        members: { include: { user: true } },
        tasks: {
          include: { assignee: true, comments: { include: { user: true } } },
        },
        owner: true,
      },
    });
    res.json({
      project: projectWithMembers,
      message: "project created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

//update project

export const updateProject = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

//add a member to project

export const addMember = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
