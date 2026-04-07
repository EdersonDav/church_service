export abstract class BaseRepository<T> {
    abstract save(entity: Partial<T>): Promise<T>;
    abstract delete(id: string): Promise<void>;
}
