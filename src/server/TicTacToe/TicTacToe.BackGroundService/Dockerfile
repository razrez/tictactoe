FROM mcr.microsoft.com/dotnet/runtime:6.0 AS base
ENV ASPNETCORE_ENVIRONMENT=Development 
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["TicTacToe.BackGroundService/TicTacToe.BackGroundService.csproj", "TicTacToe.BackGroundService/"]
RUN dotnet restore "TicTacToe.BackGroundService/TicTacToe.BackGroundService.csproj"
COPY ["TicTacToe.Domain/TicTacToe.Domain.csproj", "TicTacToe.Domain/"]
COPY ["TicTacToe.Infrastructure/TicTacToe.Infrastructure.csproj", "TicTacToe.Infrastructure/"]
COPY ["TicTacToe.AppCore/TicTacToe.AppCore.csproj", "TicTacToe.AppCore/"]
COPY . .
WORKDIR "/src/TicTacToe.BackGroundService"
RUN dotnet build "TicTacToe.BackGroundService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TicTacToe.BackGroundService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TicTacToe.BackGroundService.dll"]
