type Project = {};

type ProjectsState = Record<string, Project>;

export const useProjectsStore = defineStore('projects', {
    state: (): ProjectsState => ({})
})
