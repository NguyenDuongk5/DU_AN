    using DAL.Base.IRepo;
    using DAL.Base.Repo;
    using DAL.IRepo.Activity;
    using DAL.IRepo.Comment;
    using DAL.IRepo.Member;
    using DAL.IRepo.Notification;
    using DAL.IRepo.Post;
    using DAL.IRepo.Project;
    using DAL.IRepo.Role;
    using DAL.IRepo.Users;
    using DAL.Repo.Activity;
    using DAL.Repo.Comment;
    using DAL.Repo.Member;
    using DAL.Repo.Notification;
    using DAL.Repo.Post;
    using DAL.Repo.Project;
    using DAL.Repo.Role;
    using DAL.Repo.Users;
    using Microsoft.OpenApi.Models; 
    using SERVICE.Base.IService;
    using SERVICE.Base.Service;
    using SERVICE.IService.Activity;
    using SERVICE.IService.Comment;
    using SERVICE.IService.Member;
    using SERVICE.IService.Notification;
    using SERVICE.IService.Post;
    using SERVICE.IService.Project;
    using SERVICE.IService.Role;
    using SERVICE.IService.Users;
    using SERVICE.Service.Activity;
    using SERVICE.Service.Comment;
    using SERVICE.Service.Member;
    using SERVICE.Service.Notification;
    using SERVICE.Service.Post;
    using SERVICE.Service.Project;
    using SERVICE.Service.Role;
    using SERVICE.Service.Users;
    //using System.Text;

    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddControllers();
    builder.Services.AddRouting(opt => opt.LowercaseUrls = true);
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddScoped(typeof(IBaseRepo<,>), typeof(BaseRepo<,>));
    builder.Services.AddScoped<IPostRepo, PostRepo>();
    builder.Services.AddScoped<IUsersRepo, UsersRepo>();
    builder.Services.AddScoped<IProjectRepo, ProjectRepo>();
    builder.Services.AddScoped<IRoleRepo, RoleRepo>();
    builder.Services.AddScoped<IMemberRepo, MemberRepo>();
    builder.Services.AddScoped<ICommentRepo, CommentRepo>();
    builder.Services.AddScoped<INotificationRepo, NotificationRepo>();
    builder.Services.AddScoped<IActivityRepo, ActivityRepo>();




    builder.Services.AddScoped(typeof(IBaseService<,>), typeof(BaseService<,>));
    builder.Services.AddScoped<IPostService, PostService>();
    builder.Services.AddScoped<IUsersService, UserService>();
    builder.Services.AddScoped<IProjectService, ProjectService>();
    builder.Services.AddScoped<IRoleService, RoleService>();
    builder.Services.AddScoped<IMemberService, MemberService>();
    builder.Services.AddScoped<ICommentService, CommentService>();
    builder.Services.AddScoped<INotificationService, NotificationService>();
    builder.Services.AddScoped<IActivityService, ActivityService>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            policy =>
            {
                policy
                    .WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
    });

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    //app.UseCors("AllowAll");
    app.UseCors("AllowFrontend");

app.UseStaticFiles();
app.MapControllers();
    app.Run();
