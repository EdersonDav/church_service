export abstract class BaseRepository<T> {
    abstract save(entity: Partial<T>): Promise<T>;
}
