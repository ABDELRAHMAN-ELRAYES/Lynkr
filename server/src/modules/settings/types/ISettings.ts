export type ISettings = {
    id: string;
    key: string;
    value: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UpdateSettingsRequest = {
    value: string;
};

export type SettingsResponse = ISettings;
