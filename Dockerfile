
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY TaskManager.Server/TaskManager.Server.csproj TaskManager.Server/

RUN dotnet restore TaskManager.Server/TaskManager.Server.csproj \
    -p:SkipFrontendProject=true

COPY TaskManager.Server/ TaskManager.Server/

RUN dotnet publish TaskManager.Server/TaskManager.Server.csproj \
    -c Release \
    -o /app/publish \
    --no-restore \
    -p:SkipFrontendProject=true \
    /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "TaskManager.Server.dll"]
