# https://hub.docker.com/_/microsoft-dotnet
FROM microsoft/dotnet:sdk AS build
WORKDIR /source/cema-ui/

# copy csproj and restore as distinct layers
COPY *.sln .
COPY *.csproj .
RUN dotnet restore

# copy everything else and build app
COPY . .
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "cema-ui.dll"]