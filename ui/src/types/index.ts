export interface Vehicle {
    make: string | null;
    model: string | null;
    badge: string | null;
}

export interface SubmitObj extends Vehicle {
    logbook: File | null;
}