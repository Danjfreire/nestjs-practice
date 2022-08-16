export interface School {
    id : string;
    name : string;
    state ?: string;
    description ?: string;
}

export interface CreateSchoolDTO {
    name : string;
    state ?: string;
    description ?: string;
}