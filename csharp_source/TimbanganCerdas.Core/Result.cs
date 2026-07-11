namespace TimbanganCerdas.Core;

public record Result<T>(bool Success, T? Data, string? ErrorMessage)
{
    public static Result<T> Ok(T data) => new(true, data, null);
    public static Result<T> Fail(string errorMessage) => new(false, default, errorMessage);
}

public record Result(bool Success, string? ErrorMessage)
{
    public static Result Ok() => new(true, null);
    public static Result Fail(string errorMessage) => new(false, errorMessage);
}
