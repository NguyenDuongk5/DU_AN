using DAL.Entity.Post.Dto;
using DAL.Entity.Users;
using SERVICE.Base.IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SERVICE.IService.Users
{
    public interface IUsersService : IBaseService<UsersEntity, UsersDto>
    {
        Task<List<UserProjectDto>> GetUserProjects(Guid userId);
        Task<List<PostDto>> GetPostsByUserId(Guid userId);

        Task<string> Register(RegisterRequest request);
        
        Task<object> Login(LoginRequest request);

        Task<bool> UpdateUser(UsersDto dto);
        Task<bool> ForgotPassword(ForgotPasswordRequest request);
        Task<UsersEntity> GetById(Guid id);
        Task<bool> ApproveMember(Guid idNguoiDung, Guid idDuAn);

        // thêm
        Task<bool> DeleteUser(Guid id);
        Task<bool> UpdateStatus(Guid id, int status);
    }
}
