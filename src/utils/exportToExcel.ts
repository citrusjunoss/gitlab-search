import * as XLSX from 'xlsx';

interface StatData {
  index: number;
  projectName: string;
  projectLink: string;
  files: string[];
}

export const exportToExcel = (
  data: StatData[],
  fileName: string = 'gitlab-search-stats',
) => {
  // 将数据转换为工作表所需的格式
  const formattedData = data.map((item) => ({
    序号: item.index,
    项目名称: item.projectName,
    项目链接: item.projectLink,
    文件列表: item.files.join('\n'), // 将文件数组转换为换行分隔的字符串
  }));

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // 设置列宽 (可选)
  worksheet['!cols'] = [
    { wch: 5 }, // 序号
    { wch: 40 }, // 项目名称
    { wch: 50 }, // 项目链接
    { wch: 80 }, // 文件列表
  ];

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Search Stats');

  // 导出文件
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
