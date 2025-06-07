import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john.doe@example.com",
        name: "John Doe",
        password: "hashedpassword123", // In real app, this should be properly hashed
      },
    }),
    prisma.user.create({
      data: {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        password: "hashedpassword456",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
        password: "hashedpassword789",
      },
    }),
    prisma.user.create({
      data: {
        email: "alice.johnson@example.com",
        name: "Alice Johnson",
        password: "hashedpassword101",
      },
    }),
  ]);

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({
      data: {
        name: "Bug",
        color: "#ef4444",
      },
    }),
    prisma.label.create({
      data: {
        name: "Feature",
        color: "#3b82f6",
      },
    }),
    prisma.label.create({
      data: {
        name: "Enhancement",
        color: "#10b981",
      },
    }),
    prisma.label.create({
      data: {
        name: "Documentation",
        color: "#8b5cf6",
      },
    }),
    prisma.label.create({
      data: {
        name: "Urgent",
        color: "#f59e0b",
      },
    }),
  ]);

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Task Management System",
      description: "A comprehensive project management application with task tracking, team collaboration, and reporting features.",
      createdById: users[0].id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "E-commerce Platform",
      description: "Modern e-commerce solution with payment integration, inventory management, and customer portal.",
      createdById: users[1].id,
    },
  });

  // Create project members
  await Promise.all([
    // Project 1 members
    prisma.projectMember.create({
      data: {
        projectId: project1.id,
        userId: users[0].id,
        role: "OWNER",
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: project1.id,
        userId: users[1].id,
        role: "ADMIN",
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: project1.id,
        userId: users[2].id,
        role: "MEMBER",
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: project1.id,
        userId: users[3].id,
        role: "MEMBER",
      },
    }),
    // Project 2 members
    prisma.projectMember.create({
      data: {
        projectId: project2.id,
        userId: users[1].id,
        role: "OWNER",
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: project2.id,
        userId: users[0].id,
        role: "MEMBER",
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: project2.id,
        userId: users[3].id,
        role: "MEMBER",
      },
    }),
  ]);

  // Create tasks for Project 1
  const tasks = await Promise.all([
    // TODO tasks
    prisma.task.create({
      data: {
        title: "Design user authentication flow",
        description: "Create wireframes and mockups for login, registration, and password reset flows. Include social login options and two-factor authentication.",
        status: "TODO",
        priority: "HIGH",
        projectId: project1.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.task.create({
      data: {
        title: "Set up CI/CD pipeline",
        description: "Configure automated testing and deployment pipeline using GitHub Actions. Include code quality checks and security scanning.",
        status: "TODO",
        priority: "MEDIUM",
        projectId: project1.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
    }),
    prisma.task.create({
      data: {
        title: "Create API documentation",
        description: "Document all REST API endpoints with request/response examples and authentication requirements.",
        status: "TODO",
        priority: "LOW",
        projectId: project1.id,
      },
    }),

    // IN_PROGRESS tasks
    prisma.task.create({
      data: {
        title: "Implement task creation form",
        description: "Build React form component for creating new tasks with validation, file uploads, and assignment features.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: project1.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
    }),
    prisma.task.create({
      data: {
        title: "Database schema optimization",
        description: "Analyze and optimize database queries. Add proper indexes and review relationship structures.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        projectId: project1.id,
      },
    }),

    // REVIEW tasks
    prisma.task.create({
      data: {
        title: "User profile management",
        description: "Complete user profile editing functionality with avatar upload and preference settings.",
        status: "REVIEW",
        priority: "MEDIUM",
        projectId: project1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Email notification system",
        description: "Implement email notifications for task assignments, comments, and project updates.",
        status: "REVIEW",
        priority: "LOW",
        projectId: project1.id,
      },
    }),

    // DONE tasks
    prisma.task.create({
      data: {
        title: "Project setup and configuration",
        description: "Initial project setup with React Router, Prisma, and Tailwind CSS configuration.",
        status: "DONE",
        priority: "HIGH",
        projectId: project1.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Basic task list component",
        description: "Create reusable task card component with status indicators and basic information display.",
        status: "DONE",
        priority: "MEDIUM",
        projectId: project1.id,
      },
    }),
  ]);

  // Create tasks for Project 2
  await Promise.all([
    prisma.task.create({
      data: {
        title: "Product catalog design",
        description: "Design product listing and detail pages with search and filtering capabilities.",
        status: "TODO",
        priority: "HIGH",
        projectId: project2.id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.task.create({
      data: {
        title: "Payment gateway integration",
        description: "Integrate Stripe payment processing with order management system.",
        status: "IN_PROGRESS",
        priority: "URGENT",
        projectId: project2.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.task.create({
      data: {
        title: "Inventory management system",
        description: "Build admin dashboard for managing product inventory, stock levels, and supplier information.",
        status: "REVIEW",
        priority: "MEDIUM",
        projectId: project2.id,
      },
    }),
  ]);

  // Create task assignments
  await Promise.all([
    // Assign tasks to users
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[0].id, // Design user authentication flow
        assigneeId: users[1].id, // Jane Smith
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[3].id, // Implement task creation form
        assigneeId: users[2].id, // Bob Wilson
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[3].id, // Implement task creation form (multiple assignees)
        assigneeId: users[0].id, // John Doe
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[4].id, // Database schema optimization
        assigneeId: users[3].id, // Alice Johnson
      },
    }),
    prisma.taskAssignment.create({
      data: {
        taskId: tasks[5].id, // User profile management
        assigneeId: users[1].id, // Jane Smith
      },
    }),
  ]);

  // Create task labels
  await Promise.all([
    // Assign labels to tasks
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[0].id, // Design user authentication flow
        labelId: labels[1].id, // Feature
      },
    }),
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[1].id, // Set up CI/CD pipeline
        labelId: labels[2].id, // Enhancement
      },
    }),
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[2].id, // Create API documentation
        labelId: labels[3].id, // Documentation
      },
    }),
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[3].id, // Implement task creation form
        labelId: labels[1].id, // Feature
      },
    }),
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[3].id, // Implement task creation form
        labelId: labels[4].id, // Urgent
      },
    }),
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[4].id, // Database schema optimization
        labelId: labels[2].id, // Enhancement
      },
    }),
    prisma.labelOnTask.create({
      data: {
        taskId: tasks[7].id, // Project setup
        labelId: labels[1].id, // Feature
      },
    }),
  ]);

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "I've started working on the authentication flow wireframes. Should we include magic link login as well?",
        taskId: tasks[0].id,
        authorId: users[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Great question! Yes, let's include magic link as an alternative login method. It's becoming quite popular.",
        taskId: tasks[0].id,
        authorId: users[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "The form validation is complete. Working on the file upload functionality now.",
        taskId: tasks[3].id,
        authorId: users[2].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Added proper indexes for the most frequent queries. Performance improvement is significant!",
        taskId: tasks[4].id,
        authorId: users[3].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Profile editing is ready for review. Avatar upload supports multiple formats and automatic resizing.",
        taskId: tasks[5].id,
        authorId: users[1].id,
      },
    }),
  ]);

  // Create subtasks
  const parentTask = await prisma.task.create({
    data: {
      title: "Implement dashboard analytics",
      description: "Create comprehensive analytics dashboard with charts and reports.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      projectId: project1.id,
    },
  });

  await Promise.all([
    prisma.task.create({
      data: {
        title: "Design dashboard layout",
        description: "Create wireframes and design for the analytics dashboard.",
        status: "DONE",
        priority: "MEDIUM",
        projectId: project1.id,
        parentId: parentTask.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Implement chart components",
        description: "Build reusable chart components using a charting library.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        projectId: project1.id,
        parentId: parentTask.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "Add data filtering",
        description: "Implement date range and category filtering for dashboard data.",
        status: "TODO",
        priority: "LOW",
        projectId: project1.id,
        parentId: parentTask.id,
      },
    }),
  ]);

  console.log("✅ Database has been seeded successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - 2 projects`);
  console.log(`   - ${labels.length} labels`);
  console.log(`   - ${tasks.length + 4} tasks (including subtasks)`);
  console.log(`   - 7 project memberships`);
  console.log(`   - 5 task assignments`);
  console.log(`   - 5 comments`);
  console.log(`   - 7 label assignments`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });