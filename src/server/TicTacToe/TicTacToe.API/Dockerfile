FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
ENV ASPNETCORE_ENVIRONMENT=Development 
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TicTacToe.API/TicTacToe.API.csproj", "TicTacToe.API/"]
COPY ["TicTacToe.Domain/TicTacToe.Domain.csproj", "TicTacToe.Domain/"]
COPY ["TicTacToe.Infrastructure/TicTacToe.Infrastructure.csproj", "TicTacToe.Infrastructure/"]
COPY ["TicTacToe.AppCore/TicTacToe.AppCore.csproj", "TicTacToe.AppCore/"]
RUN dotnet restore "TicTacToe.API/TicTacToe.API.csproj"
COPY . .
WORKDIR "/src/TicTacToe.API"
RUN dotnet build "TicTacToe.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TicTacToe.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TicTacToe.API.dll"]
