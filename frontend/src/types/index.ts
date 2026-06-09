export interface User {
  id: number
  username: string
  email: string
  displayName: string
}

export interface AuthResponse {
  token: string
  user: User
}

export type ProjectRole = 'OWNER' | 'LEADER' | 'SUB_LEADER' | 'MEMBER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED'

export interface ProjectMember {
  userId: number
  username: string
  displayName: string
  email: string
  role: ProjectRole
  reportsToUserId?: number
  reportsToName?: string
}

export interface Project {
  id: number
  name: string
  description: string
  owner: User
  members: ProjectMember[]
  taskCount: number
  createdAt: string
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  dueDate?: string
  projectId: number
  projectName: string
  createdBy: User
  assignees: User[]
  createdAt: string
  updatedAt: string
}
