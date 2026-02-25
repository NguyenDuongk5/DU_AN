using DAL.Base.IRepo;
using DAL.Entity.Post.Dto;
using DAL.Entity.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.IRepo.Users
{
    public interface IUsersRepo : IBaseRepo<UsersEntity, UsersDto>
    {
        Task<UsersEntity> GetByUsername(string username); 
        Task<List<UserProjectDto>> GetProjectsByUserId(Guid userId);
        Task<bool> UpdatePassword(UsersEntity entity);
        Task<bool> UpdateUser(UsersEntity entity);
        Task<bool> IsEmailExist(string email, Guid currentUserId);
        Task<UsersEntity> GetById(Guid id);
        Task<List<PostDto>> GetPostsByUserId(Guid userId);
        Task<bool> ApproveMember(Guid idNguoiDung, Guid idDuAn);

        // thêm
        Task<bool> DeleteUser(Guid id);
        Task<bool> UpdateStatus(Guid id, int status);

    }
}
